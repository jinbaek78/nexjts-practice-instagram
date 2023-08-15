import { Session } from 'next-auth';

export const fakeSession: Session = {
  user: {
    email: 'abded@gmail.com',
    image: '/fakedata',
    name: 'jin',
  },
  expires: '2023-09-14T08:21:23.720Z',
};
