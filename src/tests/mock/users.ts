import { User } from '@/types/user';

export const fakeUser: User[] = [
  {
    avatarUrl: 'https:/',
    emailName: 'testEmailName',
    name: 'testName',
    followers: 0,
    following: ['emma', 'sarah', 'alice', 'amelia', 'luna', 'david', 'james'],
    liked: ['liked1', 'liked2'],
    marked: ['marked1', 'marked2'],
    posts: ['posts1', 'post2', 'post3'],
    _createdAt: '2023-08-17T05:16:56Z',
    _id: 'mlQRzbyTLyVw7G9D8tRIQ9',
    _type: 'user',
    _rev: '',
    _updatedAt: '',
  },
];

export const fakeFollowingUserThreeInfo = [
  {
    name: 'emma',
    avatarUrl:
      'https://cdn.sanity.io/images/rfd2ipwe/instagram/00…03bc6e1add80a8c06625040fd603972-640x800.jpg?h=200',
  },

  {
    name: 'sarah',
    avatarUrl:
      'https://cdn.sanity.io/images/rfd2ipwe/instagram/c0…1ac5b8f7c50d160b1ec5a9f4f85618a6bac-3974x5000.jpg',
  },
  {
    name: 'alice',
    avatarUrl:
      'https://cdn.sanity.io/images/rfd2ipwe/instagram/ee…9d73dab0be2423295710371ebfe281384e9-3840x4800.jpg',
  },
];

export const fakeFollowingUserSevenInfo = [
  {
    name: 'emma',
    avatarUrl:
      'https://cdn.sanity.io/images/rfd2ipwe/instagram/00…03bc6e1add80a8c06625040fd603972-640x800.jpg?h=200',
  },

  {
    name: 'sarah',
    avatarUrl:
      'https://cdn.sanity.io/images/rfd2ipwe/instagram/c0…1ac5b8f7c50d160b1ec5a9f4f85618a6bac-3974x5000.jpg',
  },
  {
    name: 'alice',
    avatarUrl:
      'https://cdn.sanity.io/images/rfd2ipwe/instagram/ee…9d73dab0be2423295710371ebfe281384e9-3840x4800.jpg',
  },
  {
    name: 'amelia',
    avatarUrl:
      'https://cdn.sanity.io/images/rfd2ipwe/instagram/e4…95a3271caf278de569b66c18a1f1c9135ac-5184x3456.jpg',
  },
  {
    name: 'luna',
    avatarUrl:
      'https://cdn.sanity.io/images/rfd2ipwe/instagram/7d…ec2acac6a29f6abd4fd088762331e4e78dc-3304x4129.jpg',
  },
  {
    name: 'david',
    avatarUrl:
      'https://cdn.sanity.io/images/rfd2ipwe/instagram/09…620c694f53fd9f0d92a09d73e8abc11fb1b-3648x5472.jpg',
  },
  {
    name: 'james',
    avatarUrl:
      'https://cdn.sanity.io/images/rfd2ipwe/instagram/26…695ee39dd1585d108f36674b16edc510620-3000x4499.jpg',
  },
];
