export type Post = NewPost & {
  // user
  avatarUrl: string;
  name: string;
  userId: string;
  marked: string[];
  liked: string[];
  // made for UI
  isLiked: boolean;
  isMarked: boolean;
};

export type NewPost = {
  author: string;
  likes: number;
  comments: Comment[];
  imgAssetId: string;
  imgUrl: string;
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

export type PostOption = 'saved' | 'liked' | 'posts';
