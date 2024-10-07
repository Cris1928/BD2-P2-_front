import React, { useState } from 'react';
import Navbar from './Navbar';

const Home = () => {

  
   const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex w-full" >
      <Navbar isOpen={isOpen} toggleNavbar={toggleNavbar} />
      <div className={` absolute top-0 left-0 w-full transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-0'} flex justify-center items-center h-screen`}>
  <h1 className="text-4xl font-bold">BD2_GRUPO3</h1>
</div>
    </div>
  );
};

export default Home;