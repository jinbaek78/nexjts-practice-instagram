import { createReadStream } from 'fs';
import { client } from '../../sanity/lib/client';
import { basename } from 'path';

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
