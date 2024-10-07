import React, { useState } from 'react';
import Navbar from './Navbar';
import '../css/cliente.css';

const Cliente = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex w-full" >
      <Navbar isOpen={isOpen} toggleNavbar={toggleNavbar} />
      
      {/* Ajustar el contenido principal ; className={`transition-all duration-300 w-full ${isOpen ? 'ml-64' : 'ml-0'} z-30 p-5`} */}
      <div className={`transition-all duration-300 w-full ${isOpen ? 'ml-64' : 'ml-0'} z-90 p-5`} >
    {/*  <div className="table-container" > */}
        <table className=" border-separate border-spacing-2 border border-slate-400  ">
          <thead>
            <tr>
              <th className="border border-slate-300">State</th>
              <th className="border border-slate-300">City</th>
              <th className="border border-slate-300">City</th>
              <th className="border border-slate-300">City</th>
              <th className="border border-slate-300">City</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-300">Indianas</td>
              <td className="border border-slate-300">Indianapolis</td>
              <td className="border border-slate-300">Indianapolis</td>
              <td className="border border-slate-300">Indianapolis</td>
              <td className="border border-slate-300">Indianapolis</td>
            </tr>
          </tbody>
        </table>
         {/*  </div>*/}

      

      </div>
    </div>
  );
};

export default Cliente;