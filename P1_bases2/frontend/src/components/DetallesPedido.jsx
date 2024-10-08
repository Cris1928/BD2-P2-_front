import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import "../index.css";
import { useParams, useNavigate } from 'react-router-dom';

function DetallesPedido() {
  const { codigo_pedido } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [bodegas, setBodegas] = useState([]);
  const [detallesPedido, setDetallesPedido] = useState([]);
  const [nuevoDetalle, setNuevoDetalle] = useState({
    codigo_producto: '',
    codigo_bodega: '',
    precio_unitario: '',
    cantidad: '',
    total_producto: '', 
  });
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [ubicaciones, setUbicaciones] = useState({});
  const [showModal, setShowModal] = useState(false); 

  useEffect(() => {
    obtenerDetallesPedido();
    obtenerProductos();
    obtenerBodegas();
  }, [codigo_pedido]);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const obtenerDetallesPedido = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/pedidos/${codigo_pedido}/detalles`);
      setDetallesPedido(response.data);
    } catch (error) {
      console.error('Error al obtener los detalles del pedido:', error);
    }
  };

  const obtenerProductos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/productos');
      setProductos(response.data);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  const obtenerBodegas = async () => {
    try {
      const response = await axios.get('http://localhost:3000/bodegas');
      setBodegas(response.data);
    } catch (error) {
      console.error('Error al obtener las bodegas:', error);
    }
  };

  // Función para obtener la ubicación de un producto específico
  const obtenerUbicacionesProducto = async (codigo_producto) => {
    try {
      const response = await axios.get(`http://localhost:3000/pedidos/${codigo_pedido}/ubicacion`);
      const ubicacionProducto = response.data.find(ubicacion => ubicacion.codigo_producto === codigo_producto);
      setUbicaciones(ubicacionProducto);
      setShowModal(true); // Mostrar el modal con la información del producto
    } catch (error) {
      console.error('Error al obtener la ubicación de los productos:', error);
    }
  };

  const agregarDetallePedido = async () => {
    if (
      nuevoDetalle.codigo_producto.trim() === '' ||
      nuevoDetalle.codigo_bodega.trim() === '' ||
      nuevoDetalle.precio_unitario.trim() === '' ||
      nuevoDetalle.cantidad.trim() === '' ||
      nuevoDetalle.total_producto.trim() === ''
    ) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (!productos.find((producto) => parseInt(producto.codigo_producto) === parseInt(nuevoDetalle.codigo_producto))) {
      setError('¡El código del producto no existe!');
      return;
    }

    if (!bodegas.find((bodega) => parseInt(bodega.codigo_bodega) === parseInt(nuevoDetalle.codigo_bodega))) {
      setError('¡El código de la bodega no existe!');
      return;
    }

    try {
      await axios.post('http://localhost:3000/adddetallepedidos', {
        codigo_pedido,
        ...nuevoDetalle,
      });
      setError('');
      setNuevoDetalle({
        codigo_producto: '',
        codigo_bodega: '',
        precio_unitario: '',
        cantidad: '',
        total_producto: '', 
      });
      obtenerDetallesPedido();
      alert('¡Detalle de pedido agregado correctamente!');
    } catch (error) {
      console.error('Error al agregar el detalle de pedido:', error);
      alert('¡Error al agregar el detalle de pedido. Intenta de nuevo!');
    }
  };

  const handlePrecioCantidadChange = (e) => {
    const { name, value } = e.target;
    const newValue = value.trim();

    setNuevoDetalle((prevState) => {
      let updatedValue = {
        ...prevState,
        [name]: newValue,
      };

      // Recalcular el total si se cambió el precio o la cantidad
      if (name === 'precio_unitario' || name === 'cantidad') {
        const precio = parseFloat(updatedValue.precio_unitario) || 0;
        const cantidad = parseFloat(updatedValue.cantidad) || 0;
        updatedValue.total_producto = (precio * cantidad).toFixed(2); 
      }

      return updatedValue;
    });
  };

  // Cerrar el modal
  const cerrarModal = () => {
    setShowModal(false);
    setUbicaciones({}); 
  };

  return (
    <div className="min-h-screen p-6 bg-gray-800 text-white transition-all">

      <Navbar isOpen={isOpen} toggleNavbar={toggleNavbar} />

      <h2 className="text-3xl font-bold mb-6 text-center">Detalles del Pedido: {codigo_pedido}</h2>

      <div className="mb-6 flex items-center space-x-1">
        <button
          onClick={() => navigate('/pedidos')}
          className="bg-gray-600 text-white px-4 py-2 rounded-1-md  hover:bg-gray-700 transition duration-200"
        >
          Regresar
        </button>

        <button
          onClick={() => setShowForm(!showForm)}
          className={`${showForm ? 'bg-orange-600' : 'bg-blue-600'
          } text-white px-4 py-2 rounded-l-md hover:bg-blue-700 transition duration-200 flex-shrink-0`}
        >
          {showForm ? 'Cancelar' : 'Agregar Detalle'}
        </button>
      </div>

      {showForm && (
        <div className="border p-4 rounded mb-4 space-y-4">
          <input
            type="text"
            placeholder="Código Producto"
            value={nuevoDetalle.codigo_producto}
            onChange={(e) => setNuevoDetalle({ ...nuevoDetalle, codigo_producto: e.target.value })}
            className="border p-2 mb-2 w-full bg-gray-700 text-white"
          />
          <input
            type="text"
            placeholder="Código Bodega"
            value={nuevoDetalle.codigo_bodega}
            onChange={(e) => setNuevoDetalle({ ...nuevoDetalle, codigo_bodega: e.target.value })}
            className="border p-2 mb-2 w-full bg-gray-700 text-white"
          />
          <input
            type="number"
            placeholder="Precio Unitario"
            name="precio_unitario"
            value={nuevoDetalle.precio_unitario}
            onChange={handlePrecioCantidadChange}
            className="border p-2 mb-2 w-full bg-gray-700 text-white"
          />
          <input
            type="number"
            placeholder="Cantidad"
            name="cantidad"
            value={nuevoDetalle.cantidad}
            onChange={handlePrecioCantidadChange}
            className="border p-2 mb-2 w-full bg-gray-700 text-white"
          />
          <input
            type="text"
            placeholder="Total Producto"
            value={nuevoDetalle.total_producto}
            readOnly
            className="border p-2 mb-2 w-full bg-gray-700 text-white"
          />
          <button
            onClick={agregarDetallePedido}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
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

      <div className="mt-6">
        <h2 className="text-xl mb-2">Lista de Detalles del Pedido</h2>
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-700">
              <th className="border-b p-2">Código Producto</th>
              <th className="border-b p-2">Código Bodega</th>
              <th className="border-b p-2">Precio Unitario</th>
              <th className="border-b p-2">Cantidad</th>
              <th className="border-b p-2">Total Producto</th>
              <th className="border-b p-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {detallesPedido.map((detalle, index) => (
              <tr key={index} className="border-b hover:bg-gray-600">
                <td className="p-2">{detalle.codigo_producto}</td>
                <td className="p-2">{detalle.codigo_bodega}</td>
                <td className="p-2">{detalle.precio_unitario}</td>
                <td className="p-2">{detalle.cantidad}</td>
                <td className="p-2">{detalle.total_producto}</td>
                <td className="p-2">
                  <button
                    onClick={() => obtenerUbicacionesProducto(detalle.codigo_producto)}
                    className="bg-yellow-600 text-white px-4 py-1 rounded hover:bg-yellow-700 transition duration-200"
                  >
                    Ver Ubicación
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-md shadow-lg w-1/2">
            <h3 className="text-xl mb-4 text-white">Ubicación del Producto</h3>
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border-b p-2">Código Producto</th>
                  <th className="border-b p-2">Cantidad</th>
                  <th className="border-b p-2">Código Bodega</th>
                  <th className="border-b p-2">Cuarto Frío</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 text-white">{ubicaciones.codigo_producto}</td>
                  <td className="p-2 text-white">{ubicaciones.cantidad}</td>
                  <td className="p-2 text-white">{ubicaciones.codigo_bodega}</td>
                  <td className="p-2 text-white">{ubicaciones.codigo_cuarto_frio}</td>
                </tr>
              </tbody>
            </table>
            <button
              onClick={cerrarModal}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetallesPedido;
