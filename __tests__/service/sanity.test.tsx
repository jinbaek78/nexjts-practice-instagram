import {
  followUser,
  getAllUsers,
  getAllUsersWithFollowingInfo,
  getUserByName,
  unfollowUser,
} from '@/services/sanity';
import { fakeUsers } from '@/tests/mock/users';
import { Session } from 'next-auth';

import { client } from '../../sanity/lib/client';

import { mutate } from 'swr';
import { v4 as uuidv4 } from 'uuid';
import { fakeSession } from '@/tests/mock/session';

jest.mock('swr', () => ({ mutate: jest.fn() }));
jest.mock('uuid', () => ({ v4: jest.fn() }));
// jest.mock('../../sanity/lib/client', () => ({ client: jest.fn() }));
jest.mock('../../sanity/lib/client', () => ({
  client: {
    fetch: jest.fn(),
    patch: jest.fn(),
    inc: jest.fn(),
    dec: jest.fn(),
    insert: jest.fn(),
    commit: jest.fn(),
    splice: jest.fn(),
  },
}));

const allusers = fakeUsers;
const allUsersWithFollowingInfo = fakeUsers.map((user) => ({
  ...user,
  isFollowing: false,
}));
const allUserQuery = `*[_type == 'user']`;
const userInfo = allUsersWithFollowingInfo[0];
const userWithZeroFollowers = allUsersWithFollowingInfo[0];
const userWithOneFollowers = allUsersWithFollowingInfo[2];
const myInfo = allUsersWithFollowingInfo[1];
const { _id: userId, name: userName, followers: userFollowers } = userInfo;
const { _id: myId, following, name: myName } = myInfo;

describe('Sanity service', () => {
  beforeEach(() => {
    (client.fetch as jest.Mock).mockImplementation(async () => allusers);
    // (client.patch('test').inc as jest.Mock).mockReturnThis();
    (client.patch as jest.Mock).mockReturnThis();
    (client.patch('linkForDec').dec as jest.Mock).mockReturnThis();
    (client.patch('linkForInc').inc as jest.Mock).mockReturnThis();
    (client.patch('linkForInsert').insert as jest.Mock).mockReturnThis();
    (client.patch('linkForCommit').commit as jest.Mock).mockReturnThis();
    (client.patch('linkForSplice').splice as jest.Mock).mockReturnThis();

    // 📌
    (client.patch as jest.Mock).mockClear();
    (client.patch as jest.Mock).mockReturnThis();
    (mutate as jest.Mock).mockImplementation(async () => '');
  });

  afterEach(() => {
    (client.fetch as jest.Mock).mockClear();
    (client.patch('linkForInc').inc as jest.Mock).mockClear();
    (client.patch('linkForInsert').insert as jest.Mock).mockClear();
    (client.patch('linkForDec').dec as jest.Mock).mockClear();
    (client.patch('linkForCommit').commit as jest.Mock).mockClear();
    (client.patch('linkForSplice').splice as jest.Mock).mockClear();
    (client.patch as jest.Mock).mockClear();
    (mutate as jest.Mock).mockClear();
  });

  describe('getUserByName', () => {
    it('should return undefined when an alluser argument is not provided', async () => {
      await expect(getUserByName(undefined, 'test')).resolves.toBe(undefined);
    });

    it('should return undefined when a name argument is not provided', async () => {
      await expect(
        getUserByName(allUsersWithFollowingInfo, undefined)
      ).resolves.toBe(undefined);
    });

    it('should correctly return the found user by provided name', async () => {
      const firstUserName = allUsersWithFollowingInfo[0].name;
      await expect(
        getUserByName(allUsersWithFollowingInfo, firstUserName)
      ).resolves.toEqual([allUsersWithFollowingInfo[0]]);
    });
    it('should return an array of undefined when there is no matching user', async () => {
      await expect(
        getUserByName(allUsersWithFollowingInfo, 'unRegisteredName')
      ).resolves.toEqual([undefined]);
    });
  });

  describe('getAllUsersWithFollowingInfo', () => {
    afterEach(() => {
      (client.fetch as jest.Mock).mockReset();
    });
    it('should return undefined when a session argument is not provided', async () => {
      await expect(getAllUsersWithFollowingInfo(null)).resolves.toBe(undefined);
    });

    it('should return users with isFollowing flag', async () => {
      await expect(getAllUsersWithFollowingInfo(fakeSession)).resolves.toEqual(
        allUsersWithFollowingInfo
      );
      expect(client.fetch).toHaveBeenCalledTimes(1);
      expect(client.fetch).toHaveBeenCalledWith(allUserQuery);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      await expect(getAllUsers()).resolves.toEqual(fakeUsers);
      expect(client.fetch).toHaveBeenCalledTimes(1);
      expect(client.fetch).toHaveBeenCalledWith(allUserQuery);
    });
  });

  describe('followUser', () => {
    const incArgument = { followers: 1 };
    const insertArguments = [['after', 'following[-1]', [userName]]];
    const mutateArguments = [
      [`allUsersWithFollowingInfo/${myName}`],
      [`user/${userName}`],
      [`user/${myName}`],
    ];
    const commitArguments = [[], []];

    it('should follow a user correctly', async () => {
      await expect(followUser(userInfo, myInfo)).resolves.toBe(undefined);

      expect(client.patch as jest.Mock).toHaveBeenCalledTimes(2);
      expect((client.patch as jest.Mock).mock.calls[0][0]).toBe(userId);
      expect((client.patch as jest.Mock).mock.calls[1][0]).toBe(myId);
      expect(
        (client.patch('linkForInc').inc as jest.Mock).mock.calls[0][0]
      ).toEqual(incArgument);
      expect(
        (client.patch('linkForInc').insert as jest.Mock).mock.calls
      ).toEqual(insertArguments);
      expect(client.patch('test').commit as jest.Mock).toHaveBeenCalledTimes(2);
      expect((client.patch('test').commit as jest.Mock).mock.calls).toEqual(
        commitArguments
      );
      expect(mutate as jest.Mock).toHaveBeenCalledTimes(3);
      expect((mutate as jest.Mock).mock.calls).toEqual(mutateArguments);
    });
  });

  describe('unfolloweUser', () => {
    const {
      _id: userId,
      name: userName,
      followers: userFollowers,
    } = userWithOneFollowers;
    it('should unfollow a user correctly', async () => {
      const decArguments = { followers: userFollowers > 0 ? 1 : 0 };
      const userIndex = following?.findIndex(
        (followingUser) => followingUser === userName
      );
      const commitArguments = [[], []];
      const deleteCount = 1;
      const spliceArguments = ['following', userIndex, deleteCount];
      await expect(unfollowUser(userWithOneFollowers, myInfo)).resolves.toBe(
        undefined
      );

      //
      expect(client.patch as jest.Mock).toHaveBeenCalledTimes(2);
      expect((client.patch as jest.Mock).mock.calls[0][0]).toBe(userId);
      expect((client.patch as jest.Mock).mock.calls[1][0]).toBe(myId);
      expect(
        (client.patch('linkForInc').dec as jest.Mock).mock.calls[0][0]
      ).toEqual(decArguments);
      expect(
        (client.patch('linkForSplice').splice as jest.Mock).mock.calls[0]
      ).toEqual(spliceArguments);
      expect(client.patch('test').commit as jest.Mock).toHaveBeenCalledTimes(2);
      expect((client.patch('test').commit as jest.Mock).mock.calls).toEqual(
        commitArguments
      );
    });
  });
});
