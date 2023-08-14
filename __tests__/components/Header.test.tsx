import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '@/components/Header';
import mockRouter from 'next-router-mock';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import Button from '@/components/Button';

jest.mock('@/components/Button');

describe('Header', () => {
  afterEach(() => {
    (Button as jest.Mock).mockReset();
  });

  it('navigates to home page on instagram title click', () => {
    render(<Header />, { wrapper: MemoryRouterProvider });
    const links = screen.getAllByRole('link');
    fireEvent.click(links[0]);

    expect(mockRouter.asPath).toBe('/');
  });

  it('navigates to home page when home icon is clicked', async () => {
    render(<Header />, { wrapper: MemoryRouterProvider });
    const links = screen.getAllByRole('link');
    await fireEvent.click(links[1]);

    expect(mockRouter.asPath).toBe('/');
  });

  it('navigates to new page when search icon is clicked', async () => {
    render(<Header />, { wrapper: MemoryRouterProvider });
    const links = screen.getAllByRole('link');
    await fireEvent.click(links[2]);

    expect(mockRouter.asPath).toBe('/search');
  });

  it('navigates to new page when search icon is clicked', () => {
    render(<Header />, { wrapper: MemoryRouterProvider });
    const links = screen.getAllByRole('link');
    fireEvent.click(links[2]);

    expect(mockRouter.asPath).toBe('/search');
  });

  it('should call button component with text and textsize arguments on button click', () => {
    render(<Header />);
    expect(Button).toHaveBeenCalledTimes(1);
    expect((Button as jest.Mock).mock.calls[0][0].text).toBe('Sign in');
    expect((Button as jest.Mock).mock.calls[0][0].textSize).toBe('text-xl');
  });
});
