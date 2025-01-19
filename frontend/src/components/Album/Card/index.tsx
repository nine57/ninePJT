import './index.css';

interface Props {
  image: string;
  title: string;
  description: string;
  icon: string;
}

const AlbumCard = ({ image, title, description, icon }: Props) => {
  return (
    <div className="album-card">
      <div
        className="album-card-image"
        style={{ backgroundImage: `url(${image})` }}
      ></div>
      <div className="album-card-content">
        <div className="album-card-icon">{icon}</div>
        <div className="album-card-title">{title}</div>
        <div className="album-card-description">{description}</div>
      </div>
    </div>
  );
};

export default AlbumCard;
