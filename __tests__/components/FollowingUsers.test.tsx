import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getFollowingUserInfo } from '@/services/sanity';
import { useSession } from 'next-auth/react';
import Avatar from '@/components/Avatar';
import { PropagateLoader } from 'react-spinners';
import UsersCarousel from '@/components/UsersCarousel';
import FollowingUsers from '@/components/FollowingUsers';
import { fakeSession } from '@/tests/mock/session';
import {
  fakeFollowingUserSevenInfo,
  fakeFollowingUserThreeInfo,
} from '@/tests/mock/users';

jest.mock('@/services/sanity', () => ({ getFollowingUserInfo: jest.fn() }));
jest.mock('next-auth/react', () => ({ useSession: jest.fn() }));
jest.mock('next-auth/react');
jest.mock('@/components/Avatar');
jest.mock('react-spinners');
jest.mock('@/components/UsersCarousel');

describe('FollowingUsers', () => {
  afterEach(() => {
    (useSession as jest.Mock).mockReset();
    (getFollowingUserInfo as jest.Mock).mockClear();
    (UsersCarousel as jest.Mock).mockReset();
  });

  it('renders with loading spinner', async () => {
    (useSession as jest.Mock).mockImplementation(() => ({
      data: { ...fakeSession, user: { ...fakeSession.user, name: 'test1' } },
    }));
    (getFollowingUserInfo as jest.Mock).mockImplementation(
      async () => fakeFollowingUserThreeInfo
    );
    render(<FollowingUsers />);
    await waitFor(() => {
      expect(PropagateLoader).toHaveBeenCalledTimes(1);
    });
  });

  it('renders user Avatar without carousel ui', async () => {
    (useSession as jest.Mock).mockImplementation(() => ({
      data: { ...fakeSession, user: { ...fakeSession.user, name: 'test2' } },
    }));
    (getFollowingUserInfo as jest.Mock).mockImplementation(
      async () => fakeFollowingUserThreeInfo
    );
    render(<FollowingUsers />);
    await waitFor(() => {
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    expect(screen.getAllByRole('listitem')).toHaveLength(
      fakeFollowingUserThreeInfo.length
    );
    expect(UsersCarousel).not.toBeCalled();
  });

  it('renders user Avatar with carousel ui', async () => {
    const sevenFollowingUsers = fakeFollowingUserSevenInfo;
    (useSession as jest.Mock).mockImplementation(() => ({
      data: { ...fakeSession, user: { ...fakeSession.user, name: 'test3' } },
    }));
    (getFollowingUserInfo as jest.Mock).mockImplementation(
      async () => sevenFollowingUsers
    );
    render(<FollowingUsers />);
    await waitFor(() => {
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    expect(UsersCarousel).toBeCalled();
    expect(screen.queryByRole('listitem')).toBeNull();
  });
});
