export type User = {
  avatarUrl: string;
  emailName: string;
  followers: number;
  following: string[];
  liked: string[];

  marked: string[];
  name: string;
  posts: string[];

  _createdAt: string;
  _id: string;
  _rev?: string;
  _type: string;
  _updatedAt?: string;
};

export type UserWithFollowingInfo = User & { isFollowing: boolean };
