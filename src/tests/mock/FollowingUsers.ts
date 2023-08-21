const mockedFollowingUsers = jest.fn();

jest.mock('@/components/FollowingUsers', () => mockedFollowingUsers);

export default mockedFollowingUsers;
