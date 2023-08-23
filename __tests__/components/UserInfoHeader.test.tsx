import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Avatar from '@/components/Avatar';
import UserInfoHeader from '@/components/UserInfoHeader';
import { User } from '@/types/user';
import { fakeUser } from '@/tests/mock/users';

jest.mock('@/components/Avatar');

describe('UserInfoHeader', () => {
  const userInfo: User[] = fakeUser;
  const { emailName, followers, name, avatarUrl } = userInfo[0];
  const onClick = jest.fn();

  afterEach(() => {
    (Avatar as jest.Mock).mockReset();
    onClick.mockClear();
  });
  it('should render with userinfo', () => {
    render(
      <UserInfoHeader
        userInfo={userInfo}
        isFollowing={false}
        isLoading={false}
        isMe={false}
        onClick={onClick}
      />
    );

    expect(screen.getByText(name)).toBeInTheDocument();
    expect(screen.getByText(followers)).toBeInTheDocument();
    expect(screen.getByText(emailName)).toBeInTheDocument();
    expect(Avatar).toHaveBeenCalledTimes(1);
    expect((Avatar as jest.Mock).mock.calls[0][0].rainbow).toBe(true);
    expect((Avatar as jest.Mock).mock.calls[0][0].src).toBe(avatarUrl);
  });

  it('should display unfollow button when a user is followed', () => {
    render(
      <UserInfoHeader
        userInfo={userInfo}
        isFollowing={true}
        isLoading={false}
        isMe={false}
        onClick={onClick}
      />
    );

    expect(screen.getByTestId('unfollow')).toBeInTheDocument();
    expect(screen.queryByTestId('follow')).toBeNull();
  });

  it('should display follow button when a user is not followed', () => {
    render(
      <UserInfoHeader
        userInfo={userInfo}
        isFollowing={false}
        isLoading={false}
        isMe={false}
        onClick={onClick}
      />
    );

    expect(screen.getByTestId('follow')).toBeInTheDocument();
    expect(screen.queryByTestId('unfollow')).toBeNull();
  });

  it('should display loading spinner when the loading is set to true', () => {
    render(
      <UserInfoHeader
        userInfo={userInfo}
        isFollowing={true}
        isLoading={true}
        isMe={false}
        onClick={onClick}
      />
    );

    expect(screen.getByTestId('loadingSpinner')).toBeInTheDocument();
  });

  it('should hide loading spinner when loading is set to false', () => {
    render(
      <UserInfoHeader
        userInfo={userInfo}
        isFollowing={true}
        isLoading={false}
        isMe={false}
        onClick={onClick}
      />
    );

    expect(screen.queryByTestId('loadingSpinner')).toBeNull();
  });

  it('should not display following or unfollowing button when a isMe flag is set to true', () => {
    render(
      <UserInfoHeader
        userInfo={userInfo}
        isFollowing={true}
        isLoading={false}
        isMe={true}
        onClick={onClick}
      />
    );

    expect(screen.queryByTestId('unfollow')).toBeNull();
  });

  it('should call onclick method when a following button is clicked', async () => {
    render(
      <UserInfoHeader
        userInfo={userInfo}
        isFollowing={false}
        isLoading={false}
        isMe={false}
        onClick={onClick}
      />
    );

    const followButton = screen.getByTestId('follow');
    await userEvent.click(followButton);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should call onclick method when a unFollowing button is clicked', async () => {
    render(
      <UserInfoHeader
        userInfo={userInfo}
        isFollowing={true}
        isLoading={false}
        isMe={false}
        onClick={onClick}
      />
    );

    const unfollowButton = screen.getByTestId('unfollow');
    await userEvent.click(unfollowButton);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
