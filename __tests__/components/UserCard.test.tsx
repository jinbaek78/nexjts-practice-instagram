import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Avatar from '@/components/Avatar';
import mockRouter from 'next-router-mock';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import UserCard from '@/components/UserCard';
import { fakeUser } from '@/tests/mock/users';

jest.mock('@/components/Avatar');

describe('UserCard', () => {
  const userInfo = fakeUser[0];
  const { avatarUrl, emailName, name, followers, following } = userInfo;

  afterEach(() => {
    (Avatar as jest.Mock).mockReset();
  });

  it('should render with userinfo correctly', async () => {
    render(<UserCard userInfo={userInfo} />);

    expect(Avatar).toHaveBeenCalledTimes(1);
    expect((Avatar as jest.Mock).mock.calls[0][0].src).toBe(avatarUrl);
    expect(screen.getByText(emailName.split('@')[0])).toBeInTheDocument();
    expect(screen.getByText(name)).toBeInTheDocument();
    expect(screen.getByText(followers)).toBeInTheDocument();
    expect(screen.getByText(following.length)).toBeInTheDocument();
  });

  it('should navigate to the user detail page when a user clicks the user card', async () => {
    render(<UserCard userInfo={userInfo} />, { wrapper: MemoryRouterProvider });
    const linkElement = screen.getByRole('link');
    const pathname = `/user/${name}?name=${name}`;

    await userEvent.click(linkElement);
    expect(mockRouter.asPath).toBe(pathname);
  });
});
