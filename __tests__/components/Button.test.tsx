import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { signIn, signOut } from 'next-auth/react';
import Button from '@/components/Button';

jest.mock('next-auth/react');

describe('Button', () => {
  afterEach(() => {
    (signIn as jest.Mock).mockReset();
    (signOut as jest.Mock).mockReset();
  });

  it('opens the sign-in popup when the sign in button is clicked', () => {
    render(<Button text="Sign in" />);
    const button = screen.getByText('Sign in');
    fireEvent.click(button);

    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(signIn).toHaveBeenCalledTimes(1);
  });
  // Opens the sign-in popup when the 'Sign In' button is clicked"
  it('opens the sign-out popup when the sign out button is clicked ', () => {
    render(<Button text="Sign out" />);
    const button = screen.getByText('Sign out');
    fireEvent.click(button);

    expect(screen.getByText('Sign out')).toBeInTheDocument();
    expect(signOut).toHaveBeenCalledTimes(1);
  });
});
