import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Avatar from '@/components/Avatar';

describe('Avatar', () => {
  const src = '/src';
  const email = 'email@com';
  const name = 'name;';

  it('should render with user detail information', () => {
    render(<Avatar src={src} email={email} name={name} />);

    expect(screen.getByText(email.split('@')[0])).toBeInTheDocument();
    expect(screen.getByText(name)).toBeInTheDocument();
    const imgSrc = (screen.getByRole('img') as HTMLImageElement).src;
    expect(imgSrc).toMatch(new RegExp('src'));
  });

  it('should not render the name when called without name argument ', () => {
    render(<Avatar src={src} email={email} />);

    expect(screen.getByText(email.split('@')[0])).toBeInTheDocument();
    const imgSrc = (screen.getByRole('img') as HTMLImageElement).src;
    expect(imgSrc).toMatch(new RegExp('src'));
    expect(screen.queryByText(name)).toBeNull();
  });
});
