import React from 'react';
import { useExampleData } from '../hooks/useExampleData';
const Home: React.FC = () =>{
  const { data, loading, error } = useExampleData();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div>
      <h1>Hi, Project Page</h1>
      <p>This is the main landing page.</p>
      <div>
        <h3></h3>
        <ul>
          {data.apps.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home
