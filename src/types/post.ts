export type Post = {
  author: string;
  avatarUrl: string;
  comments: Comment[];
  content: string;
  imgAssetId: string;
  imgUrl: string;
  isLiked: boolean;
  likes: number;
  isMarked: boolean;
  marked: string[];
  liked: string[];
  userId: string;
  name: string;
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
};

export type Comment = {
  username: string;
  comment: string;
};
