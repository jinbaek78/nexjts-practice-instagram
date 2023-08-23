import { ChangeEvent } from 'react';

type Props = {
  onSearch: (event: ChangeEvent) => void;
  query: string;
};
export default function SearchInput({ onSearch, query }: Props) {
  return (
    <input
      className="w-full h-full max-w-4xl text-2xl p-3 px-5 border-2 border-zinc-300 outline-none"
      type="text"
      value={query}
      onChange={onSearch}
      placeholder="Search for a username or name"
      data-testid="searchInput"
    />
  );
}
