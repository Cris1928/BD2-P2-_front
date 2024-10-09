import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

const Productos = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [productos, setProductos] = useState([]); // Estado para almacenar los productos
  const [productoFiltrado, setProductoFiltrado] = useState(null); // Estado para el producto buscado
  const [codigoBusqueda, setCodigoBusqueda] = useState(''); // Estado para el código de búsqueda

  const [codigo, setCodigoProducto] = useState('');
  const [nombre, setNombre] = useState('');
  const [marca, setMarca] = useState('');
  const [fabricante, setFabricante] = useState('');
  const [precio, setPrecio] = useState('');

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleAddClient = () => {
    setShowForm(true); // Mostrar formulario
  };

  const handleCancel = () => {
    setShowForm(false); // Ocultar formulario
  };

  // Función para obtener los productos desde la API
  const fetchProductos = async () => {
    try {
      const response = await fetch('http://localhost:3000/productos');
      const data = await response.json();
      setProductos(data); // Guardar los productos obtenidos en el estado
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  // Función para buscar un producto por código
  const buscarProductoPorCodigo = async () => {
    try {
      const response = await fetch(`http://localhost:3000/productos/${codigoBusqueda} `);
      if (response.ok) {
        const producto = await response.json();
        setProductoFiltrado(producto); // Guardar el producto buscado
      } else {
        console.error('Producto no encontrado');
        setProductoFiltrado(null); // Limpiar si no se encuentra
      }
    } catch (error) {
      console.error('Error al buscar el producto:', error);
    }
  };
// agregamos la funcion agregar productos
const agregarProducto = async (produc) => {
  try {
    const response = await fetch('http://localhost:3000/addproductos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(produc),
    });
    // vaciar los campos
    setCodigoProducto('');
    setNombre('');
    setMarca('');
    setFabricante('');
    setPrecio('');
    setShowForm(false); // Ocultar el formulario
    // Actualizar la lista de productos
    fetchProductos();
  } catch (error) {
    console.error('Error al agregar el productos:', error);
  }
};
  // Función para restaurar la tabla a su estado original
  const restaurarTabla = () => {
    setProductoFiltrado(null); // Limpiar la búsqueda
    setCodigoBusqueda(''); // Limpiar el campo de búsqueda
  };

  useEffect(() => {
    fetchProductos(); // Obtener productos inmediatamente cuando el componente se monta
  }, []);

  return (
    <div className="flex w-full">
      <Navbar isOpen={isOpen} toggleNavbar={toggleNavbar} />
      <button
        onClick={handleAddClient}
        className="fixed top-5 right-10 p-2 rounded bg-blue-500 text-white transition-transform duration-300 z-50"
      >
        Agregar Producto
      </button>

      <div className={` absolute top-20 left-0 w-full transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-0'} flex flex-col justify-center items-center`}>
        
        {/* Mostrar formulario si showForm es verdadero */}
        {showForm && (
          <div className="mb-5 w-3/4 p-4 border border-gray-300 rounded bg-gray-100">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block">Código del producto</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded"
                value={codigo}
                onChange={(e) => setCodigoProducto(e.target.value)}
                />
              </div>
              <div>
                <label className="block">Nombre</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div>
                <label className="block">Marca</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                />
              </div>
              <div>
                <label className="block">Fabricante</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded"
                value={fabricante}
                onChange={(e) => setFabricante(e.target.value)}
                />
              </div>
              <div className='col-span-2'>
                <label className="block">Precio</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={() => agregarProducto({codigo_producto: codigo,  nombre: nombre, marca: marca, fabricante: fabricante, precio: precio})}
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

        {/* Campo de búsqueda y botones */}
        <div className={` mb-5 w-3/4 p-4 border border-gray-300 rounded bg-gray-100 flex justify-between transition-all duration-300 ${showForm ? 'mt-10' : 'mt-0'}`}>
          <input
            type="text"
            placeholder="Buscar por código"
            value={codigoBusqueda}
            onChange={(e) => setCodigoBusqueda(e.target.value)}
            className="w-2/3 p-2 border border-gray-300 rounded"
          />
          <div className="flex gap-4">
            <button
              onClick={buscarProductoPorCodigo}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Buscar
            </button>
            <button
              onClick={restaurarTabla}
              className="bg-gray-500 text-white p-2 rounded"
            >
              Restaurar
            </button>
          </div>
        </div>

        <table className={` border-separate border-spacing-2 border border-slate-400 transition-all duration-300 ${showForm ? 'mt-10' : 'mt-0'}`}>
          <thead>
            <tr>
              <th className="border border-slate-300">Código</th>
              <th className="border border-slate-300">Fecha Aplicacion</th>
              <th className="border border-slate-300">Nombre</th>
              <th className="border border-slate-300">Marca</th>
              <th className="border border-slate-300">Fabricante</th>
              <th className="border border-slate-300">Precio</th>
            </tr>
          </thead>
          <tbody>
            {productoFiltrado ? (
              <tr key={productoFiltrado.codigo_producto}>
                <td className="border border-slate-300">{productoFiltrado.codigo_producto}</td>
                <td className="border border-slate-300">{productoFiltrado.fecha_aplicacion}</td>
                <td className="border border-slate-300">{productoFiltrado.nombre}</td>
                <td className="border border-slate-300">{productoFiltrado.marca}</td>
                <td className="border border-slate-300">{productoFiltrado.fabricante}</td>
                <td className="border border-slate-300">{productoFiltrado.precio}</td>
              </tr>
            ) : productos.length > 0 ? (
              productos.map((producto) => (
                <tr key={producto.codigo_producto}>
                  <td className="border border-slate-300">{producto.codigo_producto}</td>
                  <td className="border border-slate-300">{producto.fecha_aplicacion}</td>
                  <td className="border border-slate-300">{producto.nombre}</td>
                  <td className="border border-slate-300">{producto.marca}</td>
                  <td className="border border-slate-300">{producto.fabricante}</td>
                  <td className="border border-slate-300">{producto.precio}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4">No hay productos disponibles</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Productos;
