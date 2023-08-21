import '@/tests/mock/LikedPosts';
import '@/tests/mock/MarkedPosts';

import '@/tests/mock/UserPosts';
import UserPosts from '@/tests/mock/UserPosts';
import LikedPosts from '@/tests/mock/LikedPosts';
import MarkedPosts from '@/tests/mock/MarkedPosts';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fakeUser } from '@/tests/mock/users';
import { User } from '@/types/user';
import UserInfoHeader from '@/components/UserInfoHeader';
import { getAllUsers, getUserByName } from '@/services/sanity';
import { BsGrid3X3 } from 'react-icons/bs';
import { AiOutlineHeart } from 'react-icons/ai';
import { BsBookmark } from 'react-icons/bs';
import UserPage from '@/app/user/[username]/page';
import { SWRConfig } from 'swr';

// jest.mock('@/components/LikedPosts');
// jest.mock('@/components/MarkedPosts');
// import UserPosts from '@/components/UserPosts';

jest.mock('@/components/UserInfoHeader');
jest.mock('@/services/sanity', () => ({
  getAllUsers: jest.fn(),
  getUserByName: jest.fn(),
}));
jest.mock('react-icons/bs');
jest.mock('react-icons/ai');
jest.mock('react-icons/bs');

describe('Dynamic UserPage', () => {
  const user: User = fakeUser[0];

  beforeEach(() => {
    (getAllUsers as jest.Mock).mockImplementation(async () => 'getAllUsers');
    (getUserByName as jest.Mock).mockImplementation(async (allUsers, name) => [
      user,
    ]);
  });

  afterEach(() => {
    (UserPosts as jest.Mock).mockReset();
    (LikedPosts as jest.Mock).mockReset();
    (MarkedPosts as jest.Mock).mockReset();
    (UserInfoHeader as jest.Mock).mockReset();
    (getAllUsers as jest.Mock).mockReset();
    (getUserByName as jest.Mock).mockReset();
    (BsGrid3X3 as jest.Mock).mockReset();
    (AiOutlineHeart as jest.Mock).mockReset();
    (BsBookmark as jest.Mock).mockReset();
  });

  it('should invoke UserInfoHeader when userinfo is already available', async () => {
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <UserPage searchParams={{ name: user.name }} />
      </SWRConfig>
    );

    await waitFor(() => {
      expect(UserInfoHeader).toHaveBeenCalledTimes(1);
    });

    expect((UserInfoHeader as jest.Mock).mock.calls[0][0].userInfo[0]).toEqual(
      user
    );
  });

  it('should not invoke UserInfoHeader when userinfo is not available', async () => {
    (getUserByName as jest.Mock).mockImplementation(async () => undefined);
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <UserPage searchParams={{ name: user.name }} />
      </SWRConfig>
    );

    await waitFor(() => {}, { timeout: 10 });

    expect(UserInfoHeader).not.toBeCalled();
  });

  it('should automatically trigger UserPosts when userinfo is initially available', async () => {
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <UserPage searchParams={{ name: user.name }} />
      </SWRConfig>
    );

    await waitFor(() => {}, { timeout: 10 });

    expect(UserPosts).toBeCalled();
    expect(UserPosts).toHaveBeenCalledWith(
      {
        postIds: user.posts,
        userInfo: user,
      },
      {}
    );
  });

  it('should invoke MarkedPosts when a user click the saved button', async () => {
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <UserPage searchParams={{ name: user.name }} />
      </SWRConfig>
    );
    const savedButton = screen.getByTestId('saved');
    await waitFor(() => {}, { timeout: 10 });

    await userEvent.click(savedButton);

    expect(MarkedPosts).toBeCalled();
    expect(UserPosts).toHaveBeenCalledTimes(1);
    expect(LikedPosts).not.toBeCalled();
    expect(MarkedPosts).toHaveBeenCalledWith(
      {
        postIds: user.marked,
        userInfo: user,
      },
      {}
    );
  });

  it('should invoke LikedPosts when a user click the liked button', async () => {
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <UserPage searchParams={{ name: user.name }} />
      </SWRConfig>
    );
    const likedButton = screen.getByTestId('liked');
    await waitFor(() => {}, { timeout: 10 });

    await userEvent.click(likedButton);

    expect(LikedPosts).toBeCalled();
    expect(UserPosts).toHaveBeenCalledTimes(1);
    expect(MarkedPosts).not.toBeCalled();
    expect(LikedPosts).toHaveBeenCalledWith(
      {
        postIds: user.liked,
        userInfo: user,
      },
      {}
    );
  });

  it('should invoke UserPosts when a user click the posts button again', async () => {
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <UserPage searchParams={{ name: user.name }} />
      </SWRConfig>
    );
    const postsButton = screen.getByTestId('posts');
    const likedButton = screen.getByTestId('liked');
    await waitFor(() => {}, { timeout: 10 });

    // default: 1
    await userEvent.click(likedButton);
    await waitFor(() => {}, { timeout: 10 });
    await userEvent.click(postsButton);

    expect(UserPosts).toHaveBeenCalledTimes(2);
    expect(MarkedPosts).not.toBeCalled();
    expect(UserPosts).toHaveBeenCalledWith(
      {
        postIds: user.posts,
        userInfo: user,
      },
      {}
    );
  });
});
