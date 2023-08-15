'use client';

import { redirectToSigninIfLoggedOut } from '@/utils/redirect';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();
  redirectToSigninIfLoggedOut(session);
  return <div className=""></div>;
}
