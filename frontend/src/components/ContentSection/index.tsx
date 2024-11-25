import { ReactNode } from 'react';
import './index.css';

interface Props {
  title: string;
  children: ReactNode;
}


const ContentSection = ({ title, children }:Props) => {
  return (
    <section className="content-section">
      <h2 className="section-title">{title}</h2>
      <div className="section-content">{children}</div>
    </section>
  );
};

export default ContentSection;
