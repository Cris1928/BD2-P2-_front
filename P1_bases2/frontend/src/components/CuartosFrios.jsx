import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import "../index.css";

function CuartosFrios() {

  const [cuartosFrios, setCuartosFrios] = useState([]);
  const [ListaBodegas, setListaBodegas] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [nuevoCuarto, setNuevoCuarto] = useState({
    codigo_cuarto_frio: '',
    codigo_bodega: '',
    capacidad_m3: '',
    temperatura: '',
  });
  const [codigoBodega, setCodigoBodega] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerCuartosFrios();
    obtenerBodegas();
  }, []);

  const obtenerCuartosFrios = async () => {
    try {
      const response = await axios.get('http://localhost:3000/cuartosfrios');
      setCuartosFrios(response.data);
    } catch (error) {
      console.error('Error al obtener los cuartos fríos:', error);
    }
  };

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const agregarCuartoFrio = async () => {

    setError('');
    console.log(nuevoCuarto)

    if (nuevoCuarto.codigo_bodega.trim() === '') {
      setError('El código de bodega es obligatorio.');
      return;
    } else if (nuevoCuarto.codigo_cuarto_frio.trim() === '') {
      setError('El código de cuarto frío es obligatorio.');
      return;
    } else if (nuevoCuarto.capacidad_m3.trim() === '') {
      setError('La capacidad en m³ es obligatoria.');
      return;
    } else if (nuevoCuarto.temperatura.trim() === '') {
      setError('La temperatura es obligatoria.');
      return;
    }

    const bodegaExiste = await existeBodega(parseInt(nuevoCuarto.codigo_bodega));
    if (!bodegaExiste) {
      setError('¡El código de la bodega no existe!');
      return;
    }

    const exists2 = cuartosFrios.find(cuarto => cuarto.codigo_cuarto_frio === parseInt(nuevoCuarto.codigo_cuarto_frio));
    if (exists2) {
      setError('¡El código del cuarto frío ya existe!');
      return;
    }

    try {
      await axios.post('http://localhost:3000/addcuartosfrios', nuevoCuarto);
      obtenerCuartosFrios();
      setNuevoCuarto({
        codigo_cuarto_frio: '',
        codigo_bodega: '',
        capacidad_m3: '',
        temperatura: '',
      });
      setShowForm(false);
      setError('');
      alert('¡Cuarto frío agregado correctamente!');
    } catch (error) {
      console.error('Error al agregar el cuarto frío:', error);
      alert('¡Error al agregar el cuarto frío. Intenta de nuevo!');
    }
  };

  const existeBodega = async (codigo) => {
    try {
      const response = await axios.get(`http://localhost:3000/existebodega/${codigo}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener la bodega:', error);
      return false;
    }
  };

  const obtenerCuartosPorBodega = async () => {
    if (codigoBodega.trim() === '') {
      obtenerCuartosFrios();
      return;
    }
    try {
      const response = await axios.get(`http://localhost:3000/bodegas/${codigoBodega}/cuartosfrios`);
      setCuartosFrios(response.data);
    } catch (error) {
      console.error('Error al obtener los cuartos fríos de la bodega:', error);
    }
  };

  const obtenerBodegas = async () => {
    try {
      const response = await axios.get('http://localhost:3000/bodegas');
      const lista_bodegas = response.data.map((bodega) => ({
        codigo_bodega: bodega.codigo_bodega
      }));
      setListaBodegas(lista_bodegas);
    } catch (error) {
      console.error('Error al obtener las bodegas:', error);
    }
  };


  return (
    <div className="min-h-screen p-6 bg-gray-800 text-white transition-all">

      <Navbar isOpen={isOpen} toggleNavbar={toggleNavbar} />


      <h2 className="text-3xl font-bold mb-6 text-center">Cuartos Fríos</h2>



      <div className="mb-6 flex w-full">
        <div className="flex justify-between mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700 transition duration-200"
          >
            {showForm ? 'Cancelar' : 'Agregar Cuarto Frío'}
          </button>
        </div>

        {showForm && (
          <div className="border p-4 rounded mb-4 space-y-4">
            <input
              type="text"
              placeholder="Código Cuarto Frío"
              value={nuevoCuarto.codigo_cuarto_frio}
              onChange={(e) => setNuevoCuarto({ ...nuevoCuarto, codigo_cuarto_frio: e.target.value })}
              className="border p-2 mb-2 w-full bg-gray-700 text-white"
            />
            <select
              value={nuevoCuarto.codigo_bodega}
              onChange={(e) => setNuevoCuarto({ ...nuevoCuarto, codigo_bodega: e.target.value })}
              className="border p-2 bg-gray-700 text-white"
            >
              <option value="">Selecciona una Bodega</option>
              {ListaBodegas.map((bodega) => (
                <option key={bodega.codigo_bodega} value={bodega.codigo_bodega}>
                  {bodega.codigo_bodega}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Capacidad (m³)"
              value={nuevoCuarto.capacidad_m3}
              onChange={(e) => setNuevoCuarto({ ...nuevoCuarto, capacidad_m3: e.target.value })}
              className="border p-2 mb-2 w-full bg-gray-700 text-white"
            />
            <input
              type="number"
              placeholder="Temperatura"
              value={nuevoCuarto.temperatura}
              onChange={(e) => setNuevoCuarto({ ...nuevoCuarto, temperatura: e.target.value })}
              className="border p-2 mb-2 w-full bg-gray-700 text-white"
            />
            <button
              onClick={agregarCuartoFrio}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
            >
              Agregar
            </button>
            {error && (
              <div className="bg-orange-500 text-white p-3 text-center rounded-md w-full mt-2">
                {error}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-center mb-6">
          <div className="flex items-center w-1/2 space-x-2">
            <h4 className="text-xl mb-2">Filtrar por Bodega</h4>
            <input
              type="text"
              placeholder="Código Bodega"
              value={codigoBodega}
              onChange={(e) => setCodigoBodega(e.target.value)}
              className="border p-2 w-3/5 bg-gray-700 text-white"
            />
            <button
              onClick={obtenerCuartosPorBodega}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 w-2/5"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl mb-2">Lista de Cuartos Fríos</h2>
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-700">
              <th className="border-b p-2">Código Cuarto Frío</th>
              <th className="border-b p-2">Código Bodega</th>
              <th className="border-b p-2">Capacidad (m³)</th>
              <th className="border-b p-2">Temperatura (°C)</th>
            </tr>
          </thead>
          <tbody>
            {cuartosFrios.map((cuarto, index) => (
              <tr key={index} className="border-b hover:bg-gray-600">
                <td className="p-2">{cuarto.codigo_cuarto_frio}</td>
                <td className="p-2">{cuarto.codigo_bodega}</td>
                <td className="p-2">{cuarto.capacidad_m3}</td>
                <td className="p-2">{cuarto.temperatura}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CuartosFrios;
