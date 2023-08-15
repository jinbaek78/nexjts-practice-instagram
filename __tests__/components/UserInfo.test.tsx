import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserInfo from '@/components/UserInfo';
import { useSession } from 'next-auth/react';
import { fakeSession } from '@/tests/mock/mock';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

describe('UserInfo', () => {
  const { name, email, image } = fakeSession!.user!;
  it('renders with user information', () => {
    (useSession as jest.Mock).mockImplementation(() => ({ data: fakeSession }));
    render(<UserInfo />);

    expect(screen.getByText(name!)).toBeInTheDocument();
    expect(screen.getByText(email!.split('@')[0])).toBeInTheDocument();
    const src = (screen.getByRole('img') as HTMLImageElement).src;
    const imgURL = image?.split('/')[1];
    expect(src).toMatch(new RegExp(imgURL!, 'i'));
  });
});
