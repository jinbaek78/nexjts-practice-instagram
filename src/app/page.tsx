'use client';

import FollowingUsers from '@/components/FollowingUsers';
import MyInfo from '@/components/UserInfo';
import Posts from '@/components/Posts';
import { redirectToSigninIfLoggedOut } from '@/utils/redirect';
import { useSession } from 'next-auth/react';

export default function HomePage() {
  const { data: session } = useSession();

  redirectToSigninIfLoggedOut(session);

  return (
    <div className="flex gap-16 p-8 pl-60">
      {/* <section className="basis-2/5 pl-60"> */}
      <section className="basis-3/5">
        <FollowingUsers />
        <Posts />
      </section>
      <section className="basis-2/5">
        <MyInfo />
      </section>
    </div>
  );
}
