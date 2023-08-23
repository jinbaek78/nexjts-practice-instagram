import { getPosts } from '@/services/sanity';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import PostCard from './PostCard';
import { GridLoader } from 'react-spinners';
import { Post } from '@/types/post';

export default function Posts() {
  const { data: session } = useSession();
  const {
    isLoading,
    data: posts,
    mutate,
  } = useSWR('posts', () => getPosts(session));

  const handlePostUpdateImmediately = (index: number, updated: Post) => {
    const updatedPosts = [...posts!];
    updatedPosts[index] = { ...updated };
    mutate(updatedPosts, { revalidate: false });
  };

  return (
    <div className="w-full h-full">
      {isLoading && (
        <GridLoader
          className="w-full h-full relative left-1/2 -translate-x-7 top-1/2"
          color="red"
          loading={isLoading}
        />
      )}
      {posts &&
        posts?.map((post: Post, index: number) => (
          <PostCard
            key={post._id}
            post={post}
            index={index}
            onUpdated={handlePostUpdateImmediately}
          />
        ))}
    </div>
  );
}
