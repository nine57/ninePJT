import React from 'react';
import Main from './Main.tsx';
import About from './About.tsx';
import Contact from './Contact.tsx';
import Experience from './Experience.tsx'
import Extra from './Extra.tsx';

const HomePage: React.FC = () => {
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

export default HomePage;
