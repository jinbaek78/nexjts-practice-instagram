import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/auth/signin',
  },
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_PROVIDER_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_PROVIDER_CLIENT_SECRET!,
    }),

    // ...add more providers here
  ],
};

// export default NextAuth(authOptions);

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
