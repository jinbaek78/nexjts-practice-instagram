type Props = {
  text: string;
  textSize: string;
};
const BUTTON_CLASS =
  'rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-1';
export default function Button({ text, textSize = 'text-xl' }: Props) {
  return (
    <div className={`${BUTTON_CLASS} ${textSize}`}>
      <button className="p-2 h-full w-full bg-gray-50 font-medium ">
        {text}
      </button>
    </div>
  );
}
