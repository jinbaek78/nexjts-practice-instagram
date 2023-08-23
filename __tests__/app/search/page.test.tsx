import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchInput from '@/components/SearchInput';
import UserCard from '@/components/UserCard';
import { getAllUsers } from '@/services/sanity';
import SearchPage from '@/app/search/page';
import React, { useState as useStateMock } from 'react';
import { fakeUsers } from '@/tests/mock/users';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));
jest.mock('@/components/SearchInput');
jest.mock('@/components/UserCard');
jest.mock('@/services/sanity', () => ({ getAllUsers: jest.fn() }));

describe('SearchPage', () => {
  const setState = jest.fn();
  const users = fakeUsers;
  beforeEach(() => {
    // (useStateMock as jest.Mock).mockImplementation(init => [init, setState])
  });
  afterEach(() => {
    (SearchInput as jest.Mock).mockReset();
    (UserCard as jest.Mock).mockReset();
    setState.mockClear();
  });
  it('should display all users when a query is empty', async () => {
    const initialQuery = '';
    (useStateMock as jest.Mock).mockImplementation(() => [
      initialQuery,
      setState,
    ]);
    (getAllUsers as jest.Mock).mockImplementation(async () => users);

    render(<SearchPage />);

    await waitFor(() => {
      expect(screen.getByRole('list')).toBeInTheDocument();
    });
    expect(UserCard).toHaveBeenCalledTimes(users.length);
  });

  it('should display filtered users when a query is available', async () => {
    const userStartWithAB = fakeUsers[0];
    const initialQuery = 'ab';
    (useStateMock as jest.Mock).mockImplementation(() => [
      initialQuery,
      setState,
    ]);
    (getAllUsers as jest.Mock).mockImplementation(async () => users);

    render(<SearchPage />);

    await waitFor(() => {
      expect(screen.getByRole('list')).toBeInTheDocument();
    });
    expect(UserCard).toHaveBeenCalledTimes(1);
    expect((UserCard as jest.Mock).mock.calls[0][0].userInfo).toEqual(
      userStartWithAB
    );
  });
});
