import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '@/components/Header';
import mockRouter from 'next-router-mock';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import Button from '@/components/Button';
import { useSession } from 'next-auth/react';

jest.mock('@/components/Button');
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ data: undefined })),
}));

describe('Header', () => {
  afterEach(() => {
    (Button as jest.Mock).mockReset();
    (useSession as jest.Mock).mockClear();
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
    fireEvent.click(links[2]);

    expect(mockRouter.asPath).toBe('/search');
  });

  it('displays sign in button when user is logged out', () => {
    (useSession as jest.Mock).mockImplementation(() => ({ data: 'undefined' }));
    render(<Header />);

    expect(Button).toHaveBeenCalledTimes(1);
    expect((Button as jest.Mock).mock.calls[0][0].text).toBe('Sign out');
  });

  it('display sign out button when user is logged in', () => {
    (useSession as jest.Mock).mockImplementation(() => ({ data: 'user' }));
    render(<Header />);

    expect(Button).toHaveBeenCalledTimes(1);
    expect((Button as jest.Mock).mock.calls[0][0].text).toBe('Sign out');
  });
});
