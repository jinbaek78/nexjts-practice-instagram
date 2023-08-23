import SearchInput from '@/components/SearchInput';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('SearchInput', () => {
  const onSearch = jest.fn();

  afterEach(() => {
    onSearch.mockClear();
  });
  // 'should call onSearch meth when a user type some texts'
  it('should display the passed value on the input screen', () => {
    const query = 'test';
    render(<SearchInput onSearch={onSearch} query={query} />);

    expect(screen.getByTestId('searchInput')).toHaveAttribute('value', query);
  });

  it('should invoke the onSearch method when a user types text', async () => {
    const query = 'test';
    render(<SearchInput onSearch={onSearch} query={query} />);

    const inputElement = screen.getByTestId('searchInput');
    await userEvent.type(inputElement, query);

    expect(onSearch).toHaveBeenCalledTimes(query.length);
  });
});
