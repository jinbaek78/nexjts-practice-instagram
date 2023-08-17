import { Session } from 'next-auth';
import { client } from '../../sanity/lib/client';

export function getPosts() {
  console.log('getPosts called');
  // return client.fetch('*[_type == "post"]');
  // return client.fetch(`*[_type == 'post']{
  //   name,
  //   "imageUrl": image.asset->url
  // }`);
  return client.fetch(`*[_type == 'post']`);
  // urlForImage(image).width(200).url()
}

export async function getFollowingUserInfo(session: Session | null) {
  console.log('getFollowingUserInfo called');
  if (!session) {
    console.log('there is no session');
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
  console.log('result: ', result);
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
  console.log('user data: ', res);
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
