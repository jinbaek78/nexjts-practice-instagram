import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Avatar from '@/components/Avatar';

describe('Avatar', () => {
  const src = '/src';
  const email = 'email@com';
  const name = 'name;';

  it('should render image properly', () => {
    render(<Avatar src={src} />);

    const imgSrc = (screen.getByRole('img') as HTMLImageElement).src;
    expect(imgSrc).toMatch(new RegExp('src'));
  });

  it('should properly render the image at the specified size', () => {
    render(<Avatar src={src} width={120} />);
    const width = (screen.getByRole('img') as HTMLImageElement).width;
    expect(width).toBe(120);
  });
});
