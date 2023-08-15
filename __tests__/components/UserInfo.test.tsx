import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserInfo from '@/components/UserInfo';
import { useSession } from 'next-auth/react';
import { fakeSession } from '@/tests/mock/mock';
import Avatar from '@/components/Avatar';

jest.mock('@/components/Avatar');
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

describe('UserInfo', () => {
  const { name, email, image } = fakeSession!.user!;

  afterEach(() => {
    (useSession as jest.Mock).mockReset();
    (Avatar as jest.Mock).mockReset();
  });

  it('renders', () => {
    (useSession as jest.Mock).mockImplementation(() => ({ data: fakeSession }));
    const { container } = render(<UserInfo />);
    expect(container).toMatchSnapshot();
  });
  it('renders with user information', () => {
    (useSession as jest.Mock).mockImplementation(() => ({ data: fakeSession }));
    render(<UserInfo />);

    expect(Avatar).toHaveBeenCalledTimes(1);
    expect((Avatar as jest.Mock).mock.calls[0][0].src).toBe(image);
    expect((Avatar as jest.Mock).mock.calls[0][0].email).toBe(email);
    expect((Avatar as jest.Mock).mock.calls[0][0].name).toBe(name);
  });
});
