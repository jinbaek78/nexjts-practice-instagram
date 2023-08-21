const mockedPosts = jest.fn();
jest.mock('@/components/Posts', () => mockedPosts);
export default mockedPosts;
