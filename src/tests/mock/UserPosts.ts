const mockedUserPosts = jest.fn();
jest.mock('@/components/UserPosts', () => mockedUserPosts);
export default mockedUserPosts;
