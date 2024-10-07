import React, { useState } from 'react';
import Navbar from './Navbar';

const Productos = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleAddClient = () => {
    setShowForm(true); // Mostrar formulario
  };

  const handleCancel = () => {
    setShowForm(false); // Ocultar formulario
  };

  const handleSave = () => {
    // Aquí puedes manejar el guardado de los datos
    setShowForm(false); // Ocultar formulario tras guardar
  };

  return (
    <div className="flex w-full">
      <Navbar isOpen={isOpen} toggleNavbar={toggleNavbar} />
      <button
        onClick={handleAddClient}
        className="fixed top-5 right-10 p-2 rounded bg-blue-500 text-white transition-transform duration-300 z-50"
      >
        Agregar Cliente
      </button>

      <div className={` absolute top-20 left-0 w-full transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-0'} flex flex-col justify-center items-center`}>
        
        {/* Mostrar formulario si showForm es verdadero */}
        {showForm && (
          <div className="mb-5 w-3/4 p-4 border border-gray-300 rounded bg-gray-100">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block">Código Cliente</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded" />
              </div>
              <div>
                <label className="block">Nombre Membresía</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded" />
              </div>
              <div>
                <label className="block">Representante Legal</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded" />
              </div>
              <div>
                <label className="block">Teléfono</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded" />
              </div>
              <div className="col-span-2">
                <label className="block">Dirección</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded" />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={handleSave}
                className="bg-green-500 text-white p-2 rounded"
              >
                Guardar
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-500 text-white p-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <table className={` border-separate border-spacing-2 border border-slate-400 transition-all duration-300 ${showForm ? 'mt-10' : 'mt-0'}`}>
          <thead>
            <tr>
              <th className="border border-slate-300">Código Cliente</th>
              <th className="border border-slate-300">Nombre Membresía</th>
              <th className="border border-slate-300">Representante Legal</th>
              <th className="border border-slate-300">Teléfono</th>
              <th className="border border-slate-300">Dirección</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-300">1</td>
              <td className="border border-slate-300">2</td>
              <td className="border border-slate-300">3</td>
              <td className="border border-slate-300">4</td>
              <td className="border border-slate-300">5</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Productos;