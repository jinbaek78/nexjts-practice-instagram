import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '@/components/Header';
import mockRouter from 'next-router-mock';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import Button from '@/components/Button';
import { useSession } from 'next-auth/react';
import Avatar from '@/components/Avatar';
import { fakeSession } from '@/tests/mock/session';

jest.mock('@/services/sanity', () => ({ getAllUsers: jest.fn() }));
jest.mock('@/components/Avatar');
jest.mock('@/components/Button');
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ data: undefined })),
}));

describe('Header', () => {
  afterEach(() => {
    (Button as jest.Mock).mockReset();
    (useSession as jest.Mock).mockClear();
    (Avatar as jest.Mock).mockReset();
  });

  it('navigates to home page on instagram title click', () => {
    render(<Header />, { wrapper: MemoryRouterProvider });
    const links = screen.getAllByRole('link');
    fireEvent.click(links[0]);

    expect(mockRouter.asPath).toBe('/');
  });

  it('navigates to home page when home icon is clicked', async () => {
    render(<Header />, { wrapper: MemoryRouterProvider });
    const links = screen.getAllByRole('link');
    await fireEvent.click(links[1]);

    expect(mockRouter.asPath).toBe('/');
  });

  it('navigates to new page when search icon is clicked', async () => {
    render(<Header />, { wrapper: MemoryRouterProvider });
    const links = screen.getAllByRole('link');
    await fireEvent.click(links[2]);

    expect(mockRouter.asPath).toBe('/search');
  });

  it('navigates to new page when search icon is clicked', () => {
    render(<Header />, { wrapper: MemoryRouterProvider });
    const links = screen.getAllByRole('link');
    fireEvent.click(links[3]);

    expect(mockRouter.asPath).toBe('/new');
  });

  it('navigates to user page when the user icon is clicked', () => {
    (useSession as jest.Mock).mockImplementation(() => ({
      data: fakeSession,
    }));
    render(<Header />, { wrapper: MemoryRouterProvider });
    const links = screen.getAllByRole('link');
    const fakeName = fakeSession.user?.name;
    fireEvent.click(links[links.length - 1]);

    expect(mockRouter.asPath).toBe(`/user/${fakeName}?name=${fakeName}`);
  });

  describe('Logged In', () => {
    it('should display sign out button when a user is logged in', () => {
      (useSession as jest.Mock).mockImplementation(() => ({
        data: fakeSession,
      }));
      render(<Header />);

      expect(Button).toHaveBeenCalledTimes(1);
      expect((Button as jest.Mock).mock.calls[0][0].text).toBe('Sign out');
    });

    it('should display avatar button with a correct image url when a user is logged in', () => {
      (useSession as jest.Mock).mockImplementation(() => ({
        data: fakeSession,
      }));
      render(<Header />);

      expect(Avatar).toHaveBeenCalledTimes(1);
      expect((Avatar as jest.Mock).mock.calls[0][0].rainbow).toBe(true);
      expect((Avatar as jest.Mock).mock.calls[0][0].src).toBe(
        fakeSession.user?.image
      );
    });
  });

  describe('Logged Out', () => {
    it('should display sign in button when user is logged out', () => {
      (useSession as jest.Mock).mockImplementation(() => ({
        data: 'undefined',
      }));
      render(<Header />);

      expect(Button).toHaveBeenCalledTimes(1);
    });

    it('should not display avatar button when a user is logged out', () => {
      (useSession as jest.Mock).mockImplementation(() => ({
        data: undefined,
      }));
      render(<Header />);

      expect(Avatar).not.toBeCalled();
    });
  });
});
