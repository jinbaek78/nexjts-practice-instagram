import { Session } from 'next-auth';
import { client } from '../../sanity/lib/client';
import { mutate } from 'swr';
import { Post as PostType } from '@/types/post';
import { Comment } from '@/types/post';

export async function removePostIdFromUserInfo(
  post: PostType,
  type: 'marked' | 'liked',
  callback: () => void
) {
  console.time('removePostIdFromUserInfo');
  callback();
  const { _id: postId, userId, liked, marked, likes } = post;
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
  console.timeEnd('removePostIdFromUserInfo');
  return;
}

export async function addPostIdToUSerInfo(
  post: PostType,
  type: 'marked' | 'liked',
  callback: () => void
) {
  callback();
  console.time('addPostIdToUSerInfo');
  const { _id: postId, userId, likes } = post;
  console.log('addPostIdToUSerInfo called with: ', postId, userId, type);
  const result = await client //
    .patch(userId)
    .insert('after', `${type}[-1]`, [postId])
    // .set({ liked: [] })
    // .set({ marked: [] })
    // .set({ likes: 0 })
    .commit();

  if (type === 'liked') {
    await updateLikeCount(postId, likes, 'increase');
  }

  console.log('addPostIdToUSerInfo result :', result);
  console.timeEnd('addPostIdToUSerInfo');
  return;
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
  const result = await client //
    .patch(postId)
    // .set({ comments: [] })
    .insert('after', 'comments[-1]', [newComment])
    .commit();

  console.log('addCommentToPost result: ', addCommentToPost);
  console.timeEnd('addCommentToPost');
  return mutate('posts');
}

export async function getPosts(session: Session | null) {
  console.time('getPosts');
  if (!session) {
    return;
  }
  console.log('getPosts called');
  const result = [];
  let posts;
  // to be modified => `*[_type == 'post' && author == '${userInfo[0].name or userInfo[0].following[i].name}']
  try {
    //
    posts = await client.fetch(`*[_type == 'post']`);
  } catch (error) {
    console.error(error);
  }
  console.log('raw posts: ', posts);
  const userInfo = await getOrCreateUser(session);
  const liked = userInfo[0].liked;
  const marked = userInfo[0].marked;

  for (let i = 0; i < posts.length; i++) {
    const isLiked = liked.includes(posts[i]._id);
    const isMarked = marked.includes(posts[i]._id);
    // user name and info will be modified into fetching query ( fetch('*[_type == 'user' && name == '${author}'))
    result.push({
      ...posts[i],
      isLiked,
      isMarked,
      name: userInfo[0].name,
      avatarUrl: userInfo[0].avatarUrl,
      userId: userInfo[0]._id,
      marked,
      liked,
    });
  }
  console.log('added posts: ', result);
  console.timeEnd('getPosts');
  return result;
}

export async function getFollowingUserInfo(session: Session | null) {
  if (!session) {
    return;
  }

  const result = [];
  const userInfo = (await getOrCreateUser(session))[0];
  const followingList = userInfo.following;
  for (let i = 0; i < followingList.length; i++) {
    let followingUserInfo;
    try {
      followingUserInfo = await client.fetch(
        `*[_type == 'user' && name == '${followingList[i]}']{name, avatarUrl}`
      );
    } catch (error) {
      console.error(error);
    }
    result.push(followingUserInfo[0]);
  }
  return result;
}
export async function getOrCreateUser(session: Session | null) {
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
  console.log('userInfo: ', res);
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
  author,
  content,
  imgAssetId,
  imgUrl,
}: Post) {
  const post = {
    _type: 'post',
    //
    imgUrl: imgUrl,
    imgAssetId: imgAssetId,
    content: content,
    author: author,
    //
    likes: 0,
    comments: [],
  };

  const res = await client.create(post);
  return res;
}
