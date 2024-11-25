import './index.css';

interface TitleProps {
  title?: string;
  coverImage?: string;
}

const Title = ({ title, coverImage }: TitleProps) => {
  return (
    <div className="header">
      <img src={coverImage} alt="cover" className="cover-image" />
      <h1 className="title">{title}</h1>
    </div>
  );
};

export default Title;
