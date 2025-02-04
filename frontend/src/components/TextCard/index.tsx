interface Props {
  title: string;
  content: string;
}

const TextCard = ({title, content}: Props) => (
  <div className="bg-white rounded-lg p-4">
    <h1 className="font-bold text-xl mb-2">{title}</h1>
    <p className="px-2">{content}</p>
  </div>
);

export default TextCard;