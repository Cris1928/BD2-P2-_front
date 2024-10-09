import React, { useState } from 'react';

const Navbar = ({ isOpen, toggleNavbar }) => {
  return (
    <div className="flex w-full">
      <div className={` fixed top-0 left-0 h-full w-64 bg-gray-800 p-5 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} z-40`}>
        <h2 className="text-white text-lg mb-4 ml-4">MENU</h2>
        <ul className="text-white">
          <li className="mb-2"><a href="#" className="hover:text-gray-400">Home</a></li>
          <li className="mb-2"><a href="/clientes" className="hover:text-gray-400">Cliente</a></li>
          <li className="mb-2"><a href="/productos" className="hover:text-gray-400">Productos</a></li>
          <li className="mb-2"><a href="/pedidos" className="hover:text-gray-400">Pedidos</a></li>
          <li className="mb-2"><a href="/bodegas" className="hover:text-gray-400">Bodegas</a></li>
          <li className="mb-2"><a href="/cuartosfrios" className="hover:text-gray-400">Cuartos Frios</a></li>
        </ul>
      </div>

      <button
        onClick={toggleNavbar}
        className={`fixed top-5 left-0 p-2 rounded bg-blue-500 text-white transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-64' : 'translate-x-0'
        }`}
      >
        {isOpen ? 'Close' : 'Open'} Menu
      </button>
    </div>
  );
};

export default Navbar;
