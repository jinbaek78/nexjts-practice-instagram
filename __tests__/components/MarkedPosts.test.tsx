import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { getPostsById } from '@/services/sanity';
import { GridLoader } from 'react-spinners';
import PostCard from '@/components/PostCard';
import { fakePosts } from '@/tests/mock/posts';
import { Post } from '@/types/post';
import MarkedPosts from '@/components/MarkedPosts';
import { fakeUser } from '@/tests/mock/users';
import { SWRConfig } from 'swr';

jest.mock('@/services/sanity', () => ({ getPostsById: jest.fn() }));
jest.mock('react-spinners');
jest.mock('@/components/PostCard');

describe('MarkedPosts', () => {
  const posts: Post[] = fakePosts;
  const fakeUser1 = fakeUser[0];
  const fakePost1 = posts[0];
  const fakePosts2 = posts[1];
  const markedPostIds = [fakePost1._id, fakePosts2._id];

  afterEach(() => {
    (GridLoader as jest.Mock).mockReset();
    (getPostsById as jest.Mock).mockReset();
    (PostCard as jest.Mock).mockReset();
  });
  it('should display a loading spinner initially when no cached data is available', async () => {
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <MarkedPosts postIds={markedPostIds} userInfo={fakeUser[0]} />
      </SWRConfig>
    );
    await waitFor(() => {
      expect(GridLoader).toHaveBeenCalledTimes(1);
    });
  });

  it('should display marked posts', async () => {
    (PostCard as jest.MockedFunction<typeof PostCard>).mockImplementation(
      () => <li>postcard</li>
    );
    (getPostsById as jest.Mock).mockImplementation(async () => posts);

    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <MarkedPosts postIds={markedPostIds} userInfo={fakeUser[0]} />
      </SWRConfig>
    );

    await waitFor(() => {
      expect(PostCard).toHaveBeenCalledTimes(markedPostIds.length);
    });
    expect(screen.getAllByRole('listitem')).toHaveLength(markedPostIds.length);
  });
});
