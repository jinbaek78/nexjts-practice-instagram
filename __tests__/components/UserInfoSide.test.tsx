import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSession } from 'next-auth/react';
import { fakeSession } from '@/tests/mock/session';
import Avatar from '@/components/Avatar';
import UserInfoSide from '@/components/UserInfoSide';

jest.mock('@/components/Avatar');
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

describe('UserInfoSide', () => {
  const { name, email, image } = fakeSession!.user!;

  afterEach(() => {
    (useSession as jest.Mock).mockReset();
    (Avatar as jest.Mock).mockReset();
  });

  it('renders', () => {
    (useSession as jest.Mock).mockImplementation(() => ({ data: fakeSession }));
    const { container } = render(<UserInfoSide />);
    expect(container).toMatchSnapshot();
  });
  it('renders with user information', () => {
    (useSession as jest.Mock).mockImplementation(() => ({ data: fakeSession }));
    render(<UserInfoSide />);

    expect(Avatar).toHaveBeenCalledTimes(1);
    expect((Avatar as jest.Mock).mock.calls[0][0].src).toBe(image);

    expect(screen.getByText(name!)).toBeInTheDocument();
    expect(screen.getByText(email!.split('@')[0])).toBeInTheDocument();
  });
});
