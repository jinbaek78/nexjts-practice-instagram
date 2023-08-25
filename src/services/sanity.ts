import { Session } from 'next-auth';
import { client } from '../../sanity/lib/client';
import { mutate } from 'swr';
import { NewPost, Post } from '@/types/post';
import { Comment } from '@/types/post';
import { v4 as uuidv4 } from 'uuid';
import { User, UserWithFollowingInfo } from '@/types/user';

export async function getUserByName(
  allUsers: UserWithFollowingInfo[] | undefined,
  name: string | null | undefined
) {
  if (!allUsers || !name) {
    return;
  }

  const user: UserWithFollowingInfo | undefined = allUsers.find(
    (user: User) => user.name === name
  );
  console.log('allUsers: ', allUsers);
  console.log('name: ', name);
  console.log('return: ', user);
  return [user];
}

export async function getAllUsersWithFollowingInfo(session: Session | null) {
  if (!session) {
    return;
  }

  const allUsers = await client.fetch(`*[_type == 'user']`);
  const { email: userEmail } = session.user!;
  const userInfo: User | undefined = allUsers.find(
    (user: User) => user?.emailName === userEmail
  );
  console.log('userInfo; ', userInfo);
  const result: UserWithFollowingInfo[] = [];
  const followingList = userInfo?.following;

  // 🐛 time complexity : O(n^2) => how to refactor this  array structure with object
  // so that I can search in O(1) time

  for (let i = 0; i < allUsers.length; i++) {
    const userWithFollowingInfo = { ...allUsers[i], isFollowing: false };
    if (followingList?.includes(allUsers[i].name)) {
      userWithFollowingInfo.isFollowing = true;
    }
    result.push(userWithFollowingInfo);
  }
  return result;
}

export async function getAllUsers() {
  const users = await client.fetch(`*[_type == 'user']`);
  return users;
}

export async function followUser(
  userInfo: UserWithFollowingInfo,
  myInfo: UserWithFollowingInfo
) {
  const { _id: userId, name: userName } = userInfo;
  const { _id: myId, name: myName } = myInfo;
  const userInfoUpdateResult = await client //
    .patch(userId)
    .inc({ followers: 1 })
    .commit();

  const myInfoUpdateResult = await client //
    .patch(myId)
    .insert('after', 'following[-1]', [userName])
    .commit();

  mutate(`allUsersWithFollowingInfo/${myName}`).then((res) => {
    mutate(`user/${userName}`);
    mutate(`user/${myName}`);
  });
}

export async function unfollowUser(
  userInfo: UserWithFollowingInfo,
  myInfo: UserWithFollowingInfo
) {
  const { _id: userId, name: userName, followers: userFollowers } = userInfo;
  const { _id: myId, following, name: myName } = myInfo;
  const userInfoUpdateResult = await client //
    .patch(userId)
    .dec({ followers: userFollowers > 0 ? 1 : 0 })
    .commit();
  //
  const userIndex = following?.findIndex(
    (followingUser) => followingUser === userName
  );

  console.log('unfolloweUser: username: ', userName);
  console.log('unfolloweUser: myName: ', myName);
  console.log('unfolloweUser: following: ', following);
  console.log('unfolloweUser: userIndex: ', userIndex);

  if (userIndex === -1) {
    console.log('there is no user in the followingList');
    return -1;
  }

  const myInfoUpdateResult = await client //
    .patch(myId)
    .splice('following', userIndex, 1)
    .commit();

  mutate(`allUsersWithFollowingInfo/${myName}`).then((res) => {
    mutate(`user/${userName}`);
    mutate(`user/${myName}`);
  });
}

export async function removePostIdFromUserInfo(
  post: Post,
  type: 'marked' | 'liked',
  callback?: () => void
) {
  callback && callback();
  const { name, _id: postId, userId, liked, marked, likes } = post;
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

  if (type === 'liked') {
    await updateLikeCount(postId, likes, 'decrease');
  }
  mutate('posts');
  mutate(`allUsersWithFollowingInfo/${name}`).then(() => {
    mutate(`user/${name}`);
  });
  return;
}

export async function addPostIdToUserInfo(
  post: Pick<Post, 'name' | '_id' | 'userId' | 'likes'>,
  type: 'marked' | 'liked' | 'posts',
  callback?: () => void
) {
  callback && callback();
  const { name, _id: postId, userId, likes } = post;
  const result = await client //
    .patch(userId)
    .insert('after', `${type}[-1]`, [postId])
    .commit();

  if (type === 'liked') {
    await updateLikeCount(postId, likes, 'increase');
  }

  mutate('posts');
  mutate(`allUsersWithFollowingInfo/${name}`).then(() => {
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
    result = await client //
      .patch(postId)
      .inc({ likes: 1 })
      .commit();
  } else {
    if (likes === 0) {
      return;
    }
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
  callback();
  await client //
    .patch(postId)
    .insert('after', 'comments[-1]', [newComment])
    .commit();

  return mutate('posts');
}

export async function getPostsById(ids: string[], userInfo: User) {
  if (!ids || !userInfo) {
    console.log('there is no ids or userInfo');
    return;
  }
  const result = [];
  const groqQueryIds = [];
  const { marked, liked } = userInfo;

  for (let i = 0; i < ids.length; i++) {
    groqQueryIds.push(`_id == '${ids[i]}'`);
  }
  const posts: NewPost[] = await client.fetch(
    `*[_type == 'post' && ( ${groqQueryIds.join(' || ')} )]`
  );

  for (let i = 0; i < posts.length; i++) {
    const isLiked = liked?.includes(posts[i]._id);
    const isMarked = marked?.includes(posts[i]._id);
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
  return result;
}

export async function getPosts(session: Session | null) {
  if (!session) {
    return;
  }

  const userInfo = (await getOrCreateUser(session))[0] as User;
  const { liked, marked, name, _id, following, avatarUrl } = userInfo;
  const toBeFetchedList = [userInfo.name, ...following];
  const grouqQueyNames = [];
  const result: Post[] = [];
  let posts: NewPost[];

  for (let i = 0; i < toBeFetchedList.length; i++) {
    grouqQueyNames.push(`author == '${toBeFetchedList[i]}'`);
  }

  try {
    posts = await client.fetch(
      `*[_type == 'post' && ( ${grouqQueyNames.join(' || ')} )]`
    );

    for (let i = 0; i < posts.length; i++) {
      const isLiked = liked.includes(posts[i]._id);
      const isMarked = marked.includes(posts[i]._id);
      result.push({
        avatarUrl,
        ...posts[i],
        isLiked,
        isMarked,
        name,
        userId: _id,
        marked,
        liked,
      });
    }
  } catch (error) {
    console.error(error);
  }

  // descending
  result.sort((a, b) => Date.parse(b._createdAt) - Date.parse(a._createdAt));
  // ascending
  // result.sort((a, b) => Date.parse(a._createdAt) - Date.parse(b._createdAt));
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

  const result = [];
  const username = session.user?.name;
  const userInfo = allUsers.find((user) => user.name === username);
  const followingList = userInfo?.following || [];

  for (let i = 0; i < followingList?.length; i++) {
    const foundUser = allUsers.find((user) => user.name === followingList[i]);
    if (foundUser) {
      result.push(foundUser);
    }
  }
  return result;
}
export async function getOrCreateUser(session: Session | null) {
  if (!session) {
    console.log('there is no session');
    return;
  }
  const { name, image: avatarUrl, email } = session!.user!;
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
      emailName: email,
      followers: 0,
      following: [],
      marked: [],
      liked: [],
      posts: [],
    });
  }
  return res;
}
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
  if (!session) {
    return;
  }

  const post = {
    _type: 'post',
    //
    author: session?.user?.name,
    authorAvatarUrl: session?.user?.image,
    imgUrl: imgUrl,
    imgAssetId: imgAssetId,
    //
    likes: 0,
    comments:
      comment !== ''
        ? [
            {
              username: session?.user?.name,
              comment,
              userAvatarUrl: session?.user?.image,
              _key: uuidv4(),
            },
          ]
        : [],
  };

  let newPost;
  try {
    newPost = await client.create(post);
  } catch (error) {
    console.error(error);
  }

  const userInfo = (await getOrCreateUser(session))?.[0];
  const { _id: userId, name, avatarUrl } = userInfo as User;
  const { _id, likes } = newPost as unknown as NewPost;
  const postInfo = {
    name,
    userId,
    _id,
    likes,
  };
  await addPostIdToUserInfo(postInfo, 'posts');
  return;
}
