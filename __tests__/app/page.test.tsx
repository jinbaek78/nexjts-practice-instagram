import mockRouter from 'next-router-mock';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
//
import '@/tests/mock/FollowingUsers';
import '@/tests/mock/PostsPage';
import FollowingUsers from '@/tests/mock/FollowingUsers';
import Posts from '@/tests/mock/PostsPage';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserInfoSide from '@/components/UserInfoSide';
import { redirectToSigninIfLoggedOut } from '@/utils/redirect';
import { useSession } from 'next-auth/react';
import HomePage from '@/app/page';
import { getOrCreateUser } from '@/services/sanity';
import { fakeSession } from '@/tests/mock/session';
// import Posts from '@/components/Posts';

// jest.mock('@/components/FollowingUsers');
jest.mock('@/components/Posts');
jest.mock('@/components/UserInfoSide');
jest.mock('@/utils/redirect');
jest.mock('next-auth/react');
jest.mock('@/services/sanity', () => ({ getOrCreateUser: jest.fn() }));

describe('Home Page', () => {
  afterEach(async () => {
    (useSession as jest.Mock).mockReset();
    (redirectToSigninIfLoggedOut as jest.Mock).mockReset();
    (UserInfoSide as jest.Mock).mockReset();
    (Posts as jest.Mock).mockReset();
    (FollowingUsers as jest.Mock).mockReset();
  });

  it('should redirect to /auth/signin page when a user accesses the homepage without being logged in ', async () => {
    (useSession as jest.Mock).mockImplementation(() => ({ data: undefined }));
    (redirectToSigninIfLoggedOut as jest.Mock).mockImplementation(
      async (session) => {
        if (!session) {
          mockRouter.push('/auth/signin');
          return;
        }
      }
    );

    mockRouter.push('/');
    render(<HomePage />, { wrapper: MemoryRouterProvider });

    expect(mockRouter.asPath).toBe('/auth/signin');
  });

  it('should not redirect to /auth/signin page when a user accesses the homepage with being logged in ', async () => {
    (useSession as jest.Mock).mockImplementation(() => ({ data: fakeSession }));
    (redirectToSigninIfLoggedOut as jest.Mock).mockImplementation(
      async (session) => {
        if (!session) {
          mockRouter.push('/auth/signin');
          return;
        }
      }
    );

    mockRouter.push('/');
    render(<HomePage />, { wrapper: MemoryRouterProvider });

    expect(mockRouter.asPath).toBe('/');
  });
});
