'use client';

import { redirectToSigninIfLoggedOut } from '@/utils/redirect';
import { useSession } from 'next-auth/react';

export default function NewPostPage() {
  const { data: session } = useSession();
  redirectToSigninIfLoggedOut(session);
  return <div>NewPostPage</div>;
}
