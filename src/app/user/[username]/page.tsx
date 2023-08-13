type Props = {
  params: {
    username: string;
  };
};
export default function page({ params: { username } }: Props) {
  return <div>{username} page</div>;
}
