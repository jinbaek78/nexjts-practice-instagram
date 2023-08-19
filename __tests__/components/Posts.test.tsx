import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { getPosts } from '@/services/sanity';
import { useSession } from 'next-auth/react';
import { GridLoader } from 'react-spinners';
import Posts from '@/components/Posts';
import { fakeSession } from '@/tests/mock/session';
import { fakePosts } from '@/tests/mock/posts';
import PostCard from '@/components/PostCard';

jest.mock('@/components/PostCard');
jest.mock('@/services/sanity', () => ({
  getPosts: jest.fn(() => console.log('mocked useSession called')),
}));
jest.mock('next-auth/react');
jest.mock('react-spinners');

describe.skip('Posts', () => {
  afterEach(() => {
    (useSession as jest.Mock).mockReset();
    (getPosts as jest.Mock).mockReset();
    (GridLoader as jest.Mock).mockReset();
    (PostCard as jest.Mock).mockReset();
  });

  it('should render the loading spinner when the data is being fetched', async () => {
    (useSession as jest.Mock).mockImplementation(() => {
      console.log('mocked useSession called');
      return { data: fakeSession };
    });
    (getPosts as jest.Mock).mockImplementation(async () => {
      console.log('mocked getPosts called');
      return fakePosts;
    });
    (GridLoader as jest.Mock).mockImplementation(() => {
      console.log('mocked GridLoader called');
    });

    render(<Posts />);

    waitFor(() => {
      expect(GridLoader).toHaveBeenCalledTimes(1);
    });
  });

  it('should render postcards correctly', async () => {
    let postCardCallTimes = 0;
    (useSession as jest.Mock).mockImplementation(() => {
      console.log('mocked useSession called');
      return { data: fakeSession };
    });
    (getPosts as jest.Mock).mockImplementation(async () => {
      console.log('mocked getPosts called');
      return fakePosts;
    });
    (GridLoader as jest.Mock).mockImplementation(() => {
      console.log('mocked GridLoader called');
    });
    (PostCard as jest.Mock).mockImplementation(() => {
      console.log('mocked PostCard called');
      return <li>called</li>;
    });

    render(<Posts />);
    await waitFor(() => {
      expect(screen.getAllByRole('listitem')).toHaveLength(fakePosts.length);
    });

    expect(PostCard).toHaveBeenCalledTimes(2);
    expect((PostCard as jest.Mock).mock.calls[0][0].index).toBe(0);
    expect((PostCard as jest.Mock).mock.calls[1][0].index).toBe(1);
    expect((PostCard as jest.Mock).mock.calls[0][0].post).toEqual(fakePosts[0]);
    expect((PostCard as jest.Mock).mock.calls[1][0].post).toEqual(fakePosts[1]);
  });
});
