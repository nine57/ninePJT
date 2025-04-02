import React from 'react';
import Main from './Main';
import About from './About';
import Contact from './Contact';
import Experience from './Experience'
import Extra from './Extra';

const Portfolio: React.FC = () => {
  return (
    <>
      <section className="h-screen">
        <Main/>
      </section>
      <section className="h-screen">
        <About/>
      </section>
      <section className="h-screen">
        <Experience/>
      </section>
      <section className="h-screen">
        <Contact/>
      </section>
      <section className="h-screen">
        <Extra/>
      </section>
    </>
  );
}

export default Portfolio;
