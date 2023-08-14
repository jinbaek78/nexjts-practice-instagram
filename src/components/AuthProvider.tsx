'use client';

import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

type Props = {
  session: Session;
  children: React.ReactNode;
};

export default function AuthProvider({ children, session }: Props) {
  console.log('session provider, session ', session);
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
