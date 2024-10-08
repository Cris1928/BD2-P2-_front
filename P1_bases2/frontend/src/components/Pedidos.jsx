import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [nuevoPedido, setNuevoPedido] = useState({
    codigo_pedido: '',
    codigo_cliente: '',
    total_pedido: '',
  });
  const [detallesPedido, setDetallesPedido] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showFomrFiltrar, setShowFormFiltrar] = useState(false);
  const [error, setError] = useState('');
  const [codigoCliente, setCodigoCliente] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [codigoBodega, setCodigoBodega] = useState('');
  const [estadoBodega, setEstadoBodega] = useState('pendiente'); // Estado por defecto
  const [clientes, setClientes] = useState([]); // Para seleccionar cliente
  const [bodegas, setBodegas] = useState([]); // Para seleccionar bodega
  const navigate = useNavigate();

  // Obtener los pedidos al cargar el componente
  useEffect(() => {
    obtenerPedidos();
    obtenerClientes();
    obtenerBodegas();
  }, []);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  //Obtener los pedidos 
  const obtenerPedidos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/pedidos');
      setPedidos(response.data);
    } catch (error) {
      console.error('Error al obtener los pedidos:', error);
    }
  };

  // Obtener los clientes 
  const obtenerClientes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/clientes');
      const lita_clientes = response.data.map((cliente) => ({
        codigo_cliente: cliente.codigo_cliente,
        nombre_empresa: cliente.nombre_empresa,
      }));
      setClientes(lita_clientes);
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
    }
  };

  // Obtener bodegas 
  const obtenerBodegas = async () => {
    try {
      const response = await axios.get('http://localhost:3000/bodegas');
      const lista_bodegas = response.data.map((bodega) => ({
        codigo_bodega: bodega.codigo_bodega
      }));
      setBodegas(lista_bodegas);
    } catch (error) {
      console.error('Error al obtener las bodegas:', error);
    }
  };


  // Función para obtener los pedidos filtrados por cliente y rango de fechas
  const obtenerPedidosFiltrados = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/clientes/${codigoCliente}/pedidos/rango?inicio=${fechaInicio}&fin=${fechaFin}`
      );
      setPedidos(response.data);
    } catch (error) {
      console.error('Error al obtener los pedidos filtrados:', error);
    }
  };

  // Función para obtener los pedidos filtrados por bodega y estado
  const obtenerPedidosPorBodega = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/bodegas/${codigoBodega}/pedidos/pendientes`
      );
      setPedidos(response.data);
    } catch (error) {
      console.error('Error al obtener los pedidos pendientes:', error);
    }
  };

  // Verificar el filstro "Cliente y Rango de fechas"
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    if (codigoCliente && fechaInicio && fechaFin) {
      obtenerPedidosFiltrados();
    } else {
      setError('Por favor, llena todos los campos de filtro.');
    }
  };

  // Manejar el filtro por bodega y estado
  const handleBodegaFilter = () => {
    if (codigoBodega && estadoBodega) {
      obtenerPedidosPorBodega();
    } else {
      setError('Por favor, selecciona una bodega y un estado.');
    }
  };

  const agregarPedido = async () => {

    const existePedido = pedidos.find((pedido) => parseInt(pedido.codigo_pedido) === parseInt(nuevoPedido.codigo_pedido));
    if (existePedido) {
      setError('¡El código del pedido ya existe!');
      return;
    }

    if (nuevoPedido.codigo_pedido.trim() === '' || nuevoPedido.total_pedido.trim() === '') {
      setError('Todos los campos son obligatorios.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/addpedidos', nuevoPedido);
      obtenerPedidos();
      setNuevoPedido({
        codigo_pedido: '',
        codigo_cliente: '',
        total_pedido: '',
      });
      setShowForm(false);
      setError('');
    } catch (error) {
      console.error('Error al agregar el pedido:', error);
      setError('Error al agregar el pedido. Intenta de nuevo.');
    }
  };

  const handleRowClick = (codigo_pedido) => {
    console.log('Código del pedido:', codigo_pedido);
    navigate(`/detallespedido/${codigo_pedido}`);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-800 text-white">

      <Navbar isOpen={isOpen} toggleNavbar={toggleNavbar} />

      <h2 className="text-3xl font-bold mb-4 text-center">Gestión de Pedidos</h2>

      <div className="mb-6 flex items-center space-x-1"> 

        <button
          onClick={() => {
            setShowForm(!showForm);
            setShowFormFiltrar(false);
          }}
          className={`${showForm ? 'bg-orange-600' : 'bg-blue-600'
            } text-white px-4 py-2 rounded-l-md hover:bg-blue-700 transition duration-200 flex-shrink-0`}
        >
          {showForm ? 'Cancelar Pedido' : 'Agregar Pedido'}
        </button>

        <button
          onClick={() => {
            setShowFormFiltrar(!showFomrFiltrar);
            setShowForm(false); 
          }}
          className={`${showFomrFiltrar ? 'bg-orange-600' : 'bg-blue-600'
            } text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition duration-200 flex-shrink-0`}
        >
          {showFomrFiltrar ? 'Cancelar Filtro' : 'Filtrar Pedidos'}
        </button>

      </div>

      {showForm && (
        <div className="border p-4 rounded mb-4">
          <input
            type="text"
            placeholder="Código Pedido"
            value={nuevoPedido.codigo_pedido}
            onChange={(e) => setNuevoPedido({ ...nuevoPedido, codigo_pedido: e.target.value })}
            className="border p-2 mb-2 w-full bg-gray-700 text-white"
          />
          <select
            value={nuevoPedido.codigo_cliente}
            onChange={(e) => setNuevoPedido({ ...nuevoPedido, codigo_cliente: e.target.value })}
            className="border p-2 bg-gray-700 text-white"
          >
            <option value="">Selecciona un Cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.codigo_cliente} value={cliente.codigo_cliente}>
                {cliente.nombre_empresa}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Total Pedido"
            value={nuevoPedido.total_pedido}
            onChange={(e) => setNuevoPedido({ ...nuevoPedido, total_pedido: e.target.value })}
            className="border p-2 mb-2 w-full bg-gray-700 text-white"
          />
          <button onClick={agregarPedido} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200">
            Agregar
          </button>
          
          {error && (
            <div className="bg-orange-500 text-white p-3 text-center rounded-md w-full mt-2">
              {error}
            </div>
          )}
          
        </div>
      )}

      {showFomrFiltrar && (
        <div className="border p-4 rounded mb-4">
          <form onSubmit={handleFilterSubmit} className="flex space-x-4">
            <select
              value={codigoCliente}
              onChange={(e) => setCodigoCliente(e.target.value)}
              className="border p-2 bg-gray-700 text-white"
            >
              <option value="">Selecciona un Cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.codigo_cliente} value={cliente.codigo_cliente}>
                  {cliente.nombre_empresa}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="border p-2 bg-gray-700 text-white"
            />
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="border p-2 bg-gray-700 text-white"
            />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200">
              Filtrar
            </button>
          </form>

          <div className="mt-4 flex space-x-4">
            <select
              value={codigoBodega}
              onChange={(e) => setCodigoBodega(e.target.value)}
              className="border p-2 bg-gray-700 text-white"
            >
              <option value="">Selecciona una Bodega</option>
              {bodegas.map((bodega) => (
                <option key={bodega.codigo_bodega} value={bodega.codigo_bodega}>
                  {bodega.codigo_bodega}
                </option>
              ))}
            </select>
            <select
              value={estadoBodega}
              onChange={(e) => setEstadoBodega(e.target.value)}
              className="border p-2 bg-gray-700 text-white"
            >
              <option value="pendiente">Pendiente</option>
              <option value="procesado">Procesado</option>
              <option value="enviado">Enviado</option>
            </select>
            <button
              onClick={handleBodegaFilter}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
            >
              Filtrar
            </button>
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-xl mb-2">Lista de Pedidos</h3>
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-700">
              <th className="border-b p-2">Código Pedido</th>
              <th className="border-b p-2">Código Cliente</th>
              <th className="border-b p-2">Fecha Pedido</th>
              <th className="border-b p-2">Total Pedido</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-600 cursor-pointer"
                onClick={() => handleRowClick(pedido.codigo_pedido)}
              >
                <td className="p-2">{pedido.codigo_pedido}</td>
                <td className="p-2">{pedido.codigo_cliente}</td>
                <td className="p-2">
                  {new Date(pedido.fecha_pedido).toLocaleDateString('es-ES')}
                </td>
                <td className="p-2">{pedido.total_pedido}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Pedidos;
