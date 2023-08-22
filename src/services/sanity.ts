import { Session } from 'next-auth';
import { client } from '../../sanity/lib/client';
import { mutate } from 'swr';
import { NewPost, Post as PostType } from '@/types/post';
import { Comment } from '@/types/post';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@/types/user';

export async function getUserByName(allUsers: User[], name: string) {
  console.log('getUserByName: called with allUsers, name: ', allUsers, name);

  if (!allUsers) {
    console.log('allUsers is not set yet');
    return;
  }
  console.time('getUserByName');
  const user: User | undefined = allUsers.find(
    (user: User) => user.name === name
  );
  // const user = await client.fetch(`*[_type == 'user' && name == '${name}']`);
  console.log('getUserByName: found user: ', user);
  console.timeEnd('getUserByName');
  return [user];
}

export async function getAllUsers() {
  console.time('getAllUsers');
  const users = await client.fetch(`*[_type == 'user']`);
  console.log('getAllUsers: all users info : ', users);
  console.timeEnd('getAllUsers');
  return users;
}

export async function removePostIdFromUserInfo(
  post: PostType,
  type: 'marked' | 'liked',
  callback?: () => void
) {
  console.time('removePostIdFromUserInfo');
  callback && callback();
  const { name, _id: postId, userId, liked, marked, likes } = post;
  console.log('removePostIdFromUserInfo called with: ', postId, userId, type);
  // findIndex first.
  // console.log(liked.findIndex((likedPostId) => likedPostId === postId));
  // return;
  const index =
    type === 'liked'
      ? liked.findIndex((likedPostId) => likedPostId === postId)
      : marked.findIndex((likedPostId) => likedPostId === postId);

  if (index === -1) {
    console.log('there is no matched post');
    return;
  }

  const result = await client //
    .patch(userId)
    .splice(type, index, 1)
    .commit();
  // .unset([`comments`])
  // client.patch(pinId).unset([`comments[_key==${key}]`]).commit()
  console.log('remove result: ', result);

  if (type === 'liked') {
    await updateLikeCount(postId, likes, 'decrease');
  }
  mutate('posts');
  // mutate('userInfo');
  mutate('allUsers').then((res) => {
    console.log('mutate allUsers result: ', res);
    console.log(`mutate(user/${name}) called`);
    mutate(`user/${name}`);
  });
  console.timeEnd('removePostIdFromUserInfo');
  return;
}

export async function addPostIdToUserInfo(
  post: Pick<PostType, 'name' | '_id' | 'userId' | 'likes'>,
  type: 'marked' | 'liked' | 'posts',
  callback?: () => void
) {
  callback && callback();
  const { name, _id: postId, userId, likes } = post;
  console.log('addPostIdToUserInfo called with: ', post);
  name;
  console.log('addPostIdToUserInfo args: ', postId, userId);
  const result = await client //
    .patch(userId)
    .insert('after', `${type}[-1]`, [postId])
    // .set({ posts: [] })
    // .set({ liked: [] })
    // .set({ marked: [] })
    // .set({ likes: 0 })
    .commit();

  if (type === 'liked') {
    await updateLikeCount(postId, likes, 'increase');
  }

  console.log('addPostIdToUserInfo result :', result);
  console.timeEnd('addPostIdToUserInfo');
  mutate('posts');
  // mutate('userInfo');
  mutate('allUsers').then((res) => {
    console.log('mutate allUsers result: ', res);
    console.log(`mutate(user/${name}) called`);
    mutate(`user/${name}`);
  });
  return result;
}

export async function updateLikeCount(
  postId: string,
  likes: number,
  type: 'increase' | 'decrease'
) {
  let result;
  if (type === 'increase') {
    console.log('increase in progress');
    result = await client //
      .patch(postId)
      .inc({ likes: 1 })
      .commit();
  } else {
    if (likes === 0) {
      return;
    }
    console.log('decrease in progress');
    result = await client //
      .patch(postId)
      .dec({ likes: 1 })
      .commit();
  }
  return;
}

export async function addCommentToPost(
  newComment: Comment & { _key: string },
  postId: string,
  callback: () => void
) {
  console.time('addCommentToPost');
  console.log('newComment: ', newComment);
  callback();
  await client //
    .patch(postId)
    // .set({ comments: [] })
    .insert('after', 'comments[-1]', [newComment])
    .commit();

  console.log('addCommentToPost result: ', addCommentToPost);
  console.timeEnd('addCommentToPost');
  return mutate('posts');
}

export async function getPostsById(ids: string[], userInfo: User) {
  // console.log('getPostsById called with ids, userInfo: ', ids, userInfo);
  if (!ids || !userInfo) {
    console.log('there is no ids or userInfo');
    return;
  }

  const posts: NewPost[] = [];
  const result = [];
  const { marked, liked } = userInfo;
  try {
    //
    for (let i = 0; i < ids.length; i++) {
      // how to fetch posts in a parallel way?
      const post = (
        await client.fetch(`*[_type == 'post'  && _id == '${ids[i]}']`)
      )[0];
      posts.push(post);
    }
  } catch (error) {
    console.log('got error: ', error);
    console.error(error);
  }

  for (let i = 0; i < posts.length; i++) {
    const isLiked = liked.includes(posts[i]._id);
    const isMarked = marked.includes(posts[i]._id);
    // user name and info will be modified into fetching query ( fetch('*[_type == 'user' && name == '${author}'))
    result.push({
      ...posts[i],
      isLiked,
      isMarked,
      name: userInfo?.name,
      avatarUrl: userInfo?.avatarUrl,
      userId: userInfo?._id,
      marked,
      liked,
    });
  }
  console.log('getPostsById result: ', result);
  return result;
}

export async function getPosts(session: Session | null) {
  console.log('getPosts called with session');
  console.log('is called with session: ', !!session);
  if (!session) {
    return;
  }

  const result = [];
  const posts: NewPost[] = [];
  // 📌 to be updated =>
  //  scenario1. using fetch
  // `*[_type == 'post' && author == '${UserInfo[0].name or UserInfo[0].following[i].name}']
  //  scenario2. using custom method for performance
  // 1. in all posts, author === session.users.name
  // 2. in all posts, author === UserInfo[0].following[i].name ..
  // 3. sort by time (newest order)
  try {
    posts.push(...(await client.fetch(`*[_type == 'post']`)));
  } catch (error) {
    console.log('got error: ', error);
    console.error(error);
  }
  // 🐛
  const userInfo = (await getOrCreateUser(session))[0] as User;
  const { liked, marked, name, avatarUrl, _id } = userInfo;
  //

  for (let i = 0; i < posts.length; i++) {
    const isLiked = liked.includes(posts[i]._id);
    const isMarked = marked.includes(posts[i]._id);
    // user name and info will be modified into fetching query ( fetch('*[_type == 'user' && name == '${author}'))
    result.push({
      ...posts[i],
      isLiked,
      isMarked,
      name,
      avatarUrl,
      userId: _id,
      marked,
      liked,
    });
  }
  console.log('getPosts raw post:  ', posts);
  console.log('getPosts: added posts: ', result);
  console.timeEnd('getPosts');
  return result;
}

export async function getFollowingUserInfo(
  allUsers: User[],
  session: Session | null
) {
  if (!session || !allUsers) {
    console.log('getFollowingUserInfo returned cuz not enough information');
    return;
  }
  console.time('getFollowingUserInfo');
  console.log(
    'getFollowingUserInfo called with allUsers, session: ',
    allUsers,
    session
  );
  const result = [];
  const username = session.user?.name;
  const userInfo = allUsers.find((user) => user.name === username);
  const followingList = userInfo?.following || [];

  for (let i = 0; i < followingList?.length; i++) {
    const foundUser = allUsers.find((user) => user.name === followingList[i]);
    if (foundUser) {
      console.log('foundUser:');
      result.push(foundUser);
    }
  }
  console.log('getFollowingUserInfo: result: ', result);

  // 🔥
  // const UserInfo = (await getOrCreateUser(session))[0];
  // const followingList = UserInfo.following;
  // // is there a way to fetch all data in a parallel way?
  // for (let i = 0; i < followingList.length; i++) {
  //   let followingUserInfo;
  //   try {
  //     followingUserInfo = await client.fetch(
  //       `*[_type == 'user' && name == '${followingList[i]}']`
  //     );
  //   } catch (error) {
  //     console.error(error);
  //   }
  //   result.push(followingUserInfo[0]);
  // }
  // console.log('followingUserInfo result: ', result);

  // 🔥
  console.timeEnd('getFollowingUserInfo');
  // 📌to be updated: mutate('allUsers').then(() => mutate('followingUsers))
  // after following / unfollowing
  return result;
}
export async function getOrCreateUser(
  session: Session | null
  // userInfo?: User
) {
  console.log('getOrCreateUser called');
  // if (!session && !userInfo) {
  if (!session) {
    console.log('there is no session');
    return;
  }
  const { name, image: avatarUrl, email } = session!.user!;
  const emailName = email?.split('@')[0];
  let res;
  try {
    res = await client.fetch(`*[_type == 'user' && name == '${name}']`);
  } catch (error) {
    console.error(error);
  }

  if (res.length === 0) {
    res = await client.create({
      _type: 'user',
      name,
      avatarUrl,
      emailName,
      followers: 0,
      following: [],
      marked: [],
      liked: [],
      posts: [],
    });
  }
  console.log('UserInfo: ', res);
  return res;
}

export type Post = {
  imgUrl: string;
  imgAssetId: string;
  content: string;
  author: string;
  likes?: number;
  comments?: object[];
};

export async function storeImageFileToCMS(data: any) {
  const res = await client.assets.upload('image', data, {
    filename: data.name,
  });

  return { imgUrl: res.url, imgAssetId: res.assetId };
}

export async function publishPost({
  comment,
  imgAssetId,
  imgUrl,
  session,
}: Pick<Post, 'imgUrl' | 'imgAssetId'> & {
  session: Session | null;
  comment: string;
}) {
  console.time('publishPost');
  if (!session) {
    return;
  }

  const post = {
    _type: 'post',
    //
    author: session?.user?.name,
    imgUrl: imgUrl,
    imgAssetId: imgAssetId,
    //
    likes: 0,
    comments:
      comment !== ''
        ? [{ username: session.user?.name, comment, _key: uuidv4() }]
        : [],
  };

  let newPost;
  try {
    newPost = await client.create(post);
  } catch (error) {
    console.error(error);
  }

  // 🐛 in userinfo, posts=[userId, userId, userId]...
  const userInfo = (await getOrCreateUser(session))?.[0];
  const { _id: userId, name } = userInfo as User;
  const { _id, likes } = newPost as NewPost;
  const postInfo = {
    name,
    userId,
    _id,
    likes,
  };
  const addingPostResult = await addPostIdToUserInfo(postInfo, 'posts');
  console.log('addingPostResult: ', addingPostResult);
  console.timeEnd('publishPost');
  return;
}

export async function removeAllPosts() {
  // posts = await client.fetch(`*[_type == 'post']`);
  const ids = await client.fetch(`*[_type == 'post']{_id}`);
  const mappedIds = ids.map((oneId: any) => oneId._id);
  console.log('mappedIds: ', mappedIds);
  console.log('got ids: ', ids);
  for (let i = 0; i < mappedIds?.length; i++) {
    await client.delete(mappedIds[i]);
  }

  console.log('removed all the posts');
}
