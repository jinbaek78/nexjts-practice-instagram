import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { getPostsById } from '@/services/sanity';
import { GridLoader } from 'react-spinners';
import PostCard from '@/components/PostCard';
import { fakePosts } from '@/tests/mock/posts';
import { Post } from '@/types/post';
import LikedPosts from '@/components/LikedPosts';
import { fakeUser } from '@/tests/mock/users';
import { SWRConfig } from 'swr';
import { fakeSession } from '@/tests/mock/session';

jest.mock('@/services/sanity', () => ({ getPostsById: jest.fn() }));
jest.mock('react-spinners');
jest.mock('@/components/PostCard');

describe('LikedPosts', () => {
  const posts: Post[] = fakePosts;
  const likedPostIds = fakePosts.map((post) => post._id);

  afterEach(() => {
    (GridLoader as jest.Mock).mockReset();
    (getPostsById as jest.Mock).mockReset();
    (PostCard as jest.Mock).mockReset();
  });
  it('should display a loading spinner initially when no cached data is available', async () => {
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <LikedPosts
          postIds={likedPostIds}
          userInfo={fakeUser[0]}
          session={fakeSession}
        />
      </SWRConfig>
    );
    await waitFor(() => {
      expect(GridLoader).toHaveBeenCalledTimes(1);
    });
  });

  it('should display liked posts', async () => {
    (PostCard as jest.MockedFunction<typeof PostCard>).mockImplementation(
      () => <li>postcard</li>
    );
    (getPostsById as jest.Mock).mockImplementation(async () => posts);

    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <LikedPosts
          postIds={likedPostIds}
          userInfo={fakeUser[0]}
          session={fakeSession}
        />
      </SWRConfig>
    );

    await waitFor(() => {
      expect(PostCard).toHaveBeenCalledTimes(likedPostIds.length);
    });
    expect(screen.getAllByRole('listitem')).toHaveLength(likedPostIds.length);
  });
});
