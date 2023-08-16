'use client';

import Followers from '@/components/Followers';
import MyInfo from '@/components/UserInfo';
import Posts from '@/components/Posts';
import { redirectToSigninIfLoggedOut } from '@/utils/redirect';
import { useSession } from 'next-auth/react';
import { getPosts } from '@/services/sanity';

export default function HomePage() {
  const { data: session } = useSession();

  redirectToSigninIfLoggedOut(session);
  getPosts().then((res) => console.log('got post: ', res));

  return (
    <div className="flex">
      <section className="basis-3/5">
        <Followers />
        <Posts />
      </section>
      <MyInfo />
    </div>
  );
}
