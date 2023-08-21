import { getPostsById } from '@/services/sanity';
import { User } from '@/types/user';
import useSWR from 'swr';
import PostCard from './PostCard';
import { Post } from '@/types/post';
import { GridLoader } from 'react-spinners';

type Props = {
  postIds: string[];
  userInfo: User;
};
export default function MarkedPosts({ postIds, userInfo }: Props) {
  const {
    isLoading,
    data: posts,
    mutate,
  } = useSWR(
    `markedPosts/${userInfo.name}`,
    () => getPostsById(postIds, userInfo),
    {
      revalidateOnMount: true,
    }
  );

  const handlePostUpdateImmediately = (index: number, updated: Post) => {
    const updatedPosts = [...posts!];
    updatedPosts[index] = { ...updated };
    mutate(updatedPosts, { revalidate: false });
  };

  return (
    <div>
      {isLoading && (
        <GridLoader
          className="absolute left-1/2"
          color="red"
          loading={isLoading}
          margin={2}
          size={20}
        />
      )}
      {posts && (
        <ul className="grid grid-cols-3 gap-x-7 p-2 px-12">
          {posts.map((post: Post, index: number) => (
            <PostCard
              post={post}
              index={index}
              key={post._id}
              isOnlyImage
              imageHeight={500}
              onUpdated={handlePostUpdateImmediately}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
