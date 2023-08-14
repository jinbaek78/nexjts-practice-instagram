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
    const text = 'Sign in';
    render(<Button text={text} />);
    const button = screen.getByText(text);
    fireEvent.click(button);

    expect(screen.getByText(text)).toBeInTheDocument();
    expect(signIn).toHaveBeenCalledTimes(1);
  });

  it('opens the sign-in popup when the sign in with google button is clicked', () => {
    const text = 'Sign In With Google';
    render(<Button text={text} />);
    const button = screen.getByText(text);
    fireEvent.click(button);

    expect(screen.getByText(text)).toBeInTheDocument();
    expect(signIn).toHaveBeenCalledTimes(1);
  });

  it('opens the sign-out popup when the sign out button is clicked ', () => {
    const text = 'Sign out';
    render(<Button text={text} />);
    const button = screen.getByText(text);
    fireEvent.click(button);

    expect(screen.getByText(text)).toBeInTheDocument();
    expect(signOut).toHaveBeenCalledTimes(1);
  });
});
