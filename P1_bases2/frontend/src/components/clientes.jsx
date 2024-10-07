import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import '../css/cliente.css';

const Cliente = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [clientes, setClientes] = useState([]); // Estado para almacenar los clientes
  const [codigo, setCodigoCliente] = useState([]); 
  const [empresa, setNombreEmpresa] = useState([]);
  const [representante, setRepresentanteLegal] = useState([]);
  const [telefono, setTelefono] = useState([]);
  const [direccion, setDireccion] = useState([]);
  const [tipo, setTipoCliente] = useState([]);



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

  // Función para obtener los clientes desde la API
  const fetchClientes = async () => {
    try {
      const response = await fetch('http://localhost:3000/clientes');
      const data = await response.json();
      setClientes(data); // Guardar los clientes obtenidos en el estado
      console.log('Clientes:', clientes);
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
    }
  };

// agregamos la funcion agregar Clientes
const agregarCliente = async (cliente) => {
  try {
    const response = await fetch('http://localhost:3000/addclientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cliente),
    });
    
    // vaciar los campos
    setCodigoCliente('');
    setNombreEmpresa('');
    setRepresentanteLegal('');
    setTelefono('');
    setDireccion('');
    setTipoCliente('');
    setShowForm(false); // Ocultar el formulario

    // Actualizar la lista de clientes
    fetchClientes();

  } catch (error) {
    console.error('Error al agregar el cliente:', error);
  }
};

// useEffect para hacer la consulta al montar el componente y actualizar cada 3 segundos
useEffect(() => {
  fetchClientes(); // Obtener clientes inmediatamente cuando el componente se monta

 // const interval = setInterval(() => {
  //  fetchClientes(); // Actualizar los clientes cada 3 segundos
 // }, 3000);

  // Limpiar el intervalo cuando el componente se desmonte
  //return () => clearInterval(interval);
}, []);


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
                <input type="text" className="w-full p-2 border border-gray-300 rounded"
                value={codigo}
                onChange={(e) => setCodigoCliente(e.target.value)}
                />
              </div>
              <div>
                <label className="block">Nombre Membresía</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded" 
                value={empresa}
                onChange={(e) => setNombreEmpresa(e.target.value)}
                />
              </div>
              <div>
                <label className="block">Representante Legal</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded"
                value={representante}
                onChange={(e) => setRepresentanteLegal(e.target.value)}
                />
              </div>
              <div>
                <label className="block">Teléfono</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                />
              </div>
              <div>
                <label className="block">Dirección</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded" 
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                />
              </div>
              <div>
                <label className="block">Tipo_cliente</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded"
                value={tipo}
                onChange={(e) => setTipoCliente(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={() => agregarCliente({codigo_cliente: codigo, nombre_empresa: empresa, representante_legal: representante, telefono: telefono, direccion: direccion, tipo_cliente: tipo})}
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
              <th className="border border-slate-300">Nombre Empresa</th>
              <th className="border border-slate-300">Representante Legal</th>
              <th className="border border-slate-300">Teléfono</th>
              <th className="border border-slate-300">Dirección</th>
              <th className="border border-slate-300">Tipo Cliente</th>
            </tr>
          </thead>
          <tbody>
            {clientes.length > 0 ? (
              clientes.map((cliente) => (
                <tr key={cliente.codigo_cliente}>
                  <td className="border border-slate-300">{cliente.codigo_cliente}</td>
                  <td className="border border-slate-300">{cliente.nombre_empresa}</td>
                  <td className="border border-slate-300">{cliente.representante_legal}</td>
                  <td className="border border-slate-300">{cliente.telefono}</td>
                  <td className="border border-slate-300">{cliente.direccion}</td>
                  <td className="border border-slate-300">{cliente.tipo_cliente}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4">No hay clientes disponibles</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Cliente;