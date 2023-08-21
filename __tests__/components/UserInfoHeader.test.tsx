import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Avatar from '@/components/Avatar';
import UserInfoHeader from '@/components/UserInfoHeader';
import { User } from '@/types/user';
import { fakeUser } from '@/tests/mock/users';

jest.mock('@/components/Avatar');

describe('UserInfoHeader', () => {
  const userInfo: User[] = fakeUser;
  const { emailName, followers, name, avatarUrl } = userInfo[0];
  it('should render with userinfo', () => {
    render(<UserInfoHeader userInfo={userInfo} />);

    expect(screen.getByText(name)).toBeInTheDocument();
    expect(screen.getByText(followers)).toBeInTheDocument();
    expect(screen.getByText(emailName)).toBeInTheDocument();
    expect(Avatar).toHaveBeenCalledTimes(1);
    expect((Avatar as jest.Mock).mock.calls[0][0].rainbow).toBe(true);
    expect((Avatar as jest.Mock).mock.calls[0][0].src).toBe(avatarUrl);
  });
});
