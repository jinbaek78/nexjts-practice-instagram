'use client';

import SearchInput from '@/components/SearchInput';
import UserCard from '@/components/UserCard';
import { getAllUsers } from '@/services/sanity';
import { User } from '@/types/user';
import { ChangeEvent, useState } from 'react';
import useSWR from 'swr';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const { data: allUsers } = useSWR('allUsers', () => getAllUsers());
  const results = query
    ? allUsers?.filter((user: User) => user.name.startsWith(query))
    : allUsers;
  const handleQueryChange = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    setQuery(target.value);
  };

  return (
    <section className="flex flex-col justify-center items-center w-full">
      <SearchInput onSearch={handleQueryChange} query={query} />
      {results && (
        <ul className="p-2 mt-5 w-full flex flex-col justify-center items-center">
          {results.map((user: User) => (
            <UserCard userInfo={user} key={user._id} />
          ))}
        </ul>
      )}
    </section>
  );
}
