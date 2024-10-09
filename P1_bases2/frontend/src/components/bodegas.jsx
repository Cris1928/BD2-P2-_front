import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';


const Bodegas = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [bodegas, setBodegas] = useState([]); // Estado para almacenar las bodegas
    const [bodegaFiltrado1, setBodegaFiltrado1] = useState(null); // Estado para la bodega buscado
    const [bodegaFiltrado2, setBodegaFiltrado2] = useState(null); // Estado para la bodega buscado
    const [bodegaFiltrado3, setBodegaFiltrado3] = useState(null); // Estado para la bodega buscado
    const [codigoBusqueda, setCodigoBusqueda] = useState(''); // Estado para el código de búsqueda


    const [codigo, setCodigoBodegas]=useState('');
    const [capacidad, setCapacidad]=useState('');

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
      };
    
      const handleAddBodega = () => {
        setShowForm(true); // Mostrar formulario
      };
    
      const handleCancel = () => {
        setShowForm(false); // Ocultar formulario
      };
    

      const fetchBodegas = async () => {
        try {
          const response = await fetch('http://localhost:3000/bodegas');
          const data = await response.json();
          setBodegas(data); // Guardar las bodegas obtenidos en el estado
        } catch (error) {
          console.error('Error al obtener las bodegas:', error);
        }
      };


      const buscarProductoPorBodega = async () => {
        try {
            
            setBodegaFiltrado2(null);
            setBodegaFiltrado3(null);
            const response = await fetch(`http://localhost:3000/bodegas/${codigoBusqueda}/productos `);
            if (response.ok) {
                const bodega = await response.json();
                setBodegaFiltrado1(bodega); // Guardar la bodega buscado
            } else {
                console.error('Bodega no encontrada');
                setBodegaFiltrado1(null); // Limpiar si no se encuentra
            }
        } catch (error) {
            console.error('Error al buscar la bodega:', error);
        }
    };

    const buscarCuartoPorBodega = async () => {
        try {
            setBodegaFiltrado1(null);
            setBodegaFiltrado3(null);
            const response = await fetch(`http://localhost:3000/bodegas/${codigoBusqueda}/cuartosfrios `);
            if (response.ok) {
                const bodega = await response.json();
                setBodegaFiltrado2(bodega); // Guardar la bodega buscado
            } else {
                console.error('Bodega no encontrada');
                setBodegaFiltrado2(null); // Limpiar si no se encuentra
            }
        } catch (error) {
            console.error('Error al buscar la bodega:', error);
        }
    };
    const buscarPedidoPorBodega = async () => {
        try {
            setBodegaFiltrado1(null);
            setBodegaFiltrado2(null);
            const response = await fetch(`http://localhost:3000/bodegas/${codigoBusqueda}/pedidos/pendientes`);
            if (response.ok) {
                const bodega = await response.json();
                setBodegaFiltrado3(bodega); // Guardar la bodega buscado
            } else {
                console.error('Bodega no encontrada');
                setBodegaFiltrado3(null); // Limpiar si no se encuentra
            }
        } catch (error) {
            console.error('Error al buscar la bodega:', error);
        }
    };

    const restaurarTabla = () => {
        setBodegaFiltrado1(null);
        setBodegaFiltrado2(null);
        setBodegaFiltrado3(null);
        setCodigoBusqueda('');
    };


      const agregarBodega = async (bode) => {
        try {
          const response = await fetch('http://localhost:3000/addbodegas', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bode),
          });
          //vaciar los campos
            setCodigoBodegas('');
            setCapacidad('');
            setShowForm(false); // Ocultar el formulario
          if (response.ok) {
            console.log('Bodega agregada');
            fetchBodegas(); // Actualizar la lista de bodegas
          } else {
            console.error('Error al agregar la bodega');
          }
        } catch (error) {
          console.error('Error al agregar la bodega:', error);
        }
        };

        useEffect(() => {
            fetchBodegas();
          }
            , []); // Ejecutar una sola vez al cargar el componente

      return (
        
        <div className="flex w-full"> 
          <Navbar isOpen={isOpen} toggleNavbar={toggleNavbar} />
          <button
            onClick={handleAddBodega}
            className="fixed top-5 right-10 p-2 rounded bg-blue-500 text-white transition-transform duration-300 z-50"
            >
            Agregar Bodega
            </button>
            <div className={` absolute top-20 left-0 w-full transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-0'} flex flex-col justify-center items-center`}>
            {/* Mostrar formulario si showForm es verdadero */}
        {showForm && (
            <div className="mb-5 w-3/4 p-4 border border-gray-300 rounded bg-gray-100">
            <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block">Código del bodega</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded"
                value={codigo}
                onChange={(e) => setCodigoBodegas(e.target.value)}
                />
              </div>
            <div>
                <label className="block">Codigo bodega</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded"
                value={codigo}
                onChange={(e) => setCodigoBodegas(e.target.value)}
                />
              </div>
                <div>
                    <label className="block">Capacidad</label>
                    <input type="text" className="w-full p-2 border border-gray-300 rounded"
                    value={capacidad}
                    onChange={(e) => setCapacidad(e.target.value)}
                    />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={() => agregarBodega({ codigo_bodega:codigo, capacidad_total_m3:capacidad })}
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
              onClick={buscarProductoPorBodega}
              className="bg-blue-500 text-white p-2 rounded"
            >
              productos
            </button>
            <button
              onClick={buscarCuartoPorBodega}
              className="bg-blue-500 text-white p-2 rounded"
            >
              cuartos
            </button>
            <button
              onClick={buscarPedidoPorBodega}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Pedidos
            </button>
            <button
              onClick={restaurarTabla}
              className="bg-gray-500 text-white p-2 rounded"
            >
              Restaurar
            </button>
          </div>
        </div>




        {
        bodegaFiltrado1 ? (

        <table  className={` border-separate border-spacing-2 border border-slate-400 transition-all duration-300 ${showForm ? 'mt-10' : 'mt-0'}`}>
            <thead>
                <tr>
                <th className="border border-slate-400">Codigo bodega</th>
                    <th className="border border-slate-400">Codigo Producto</th>
                    <th className="border border-slate-400">Fecha aplicacion</th>
                    <th className="border border-slate-400">Nombre</th>
                    <th className="border border-slate-400">Marca</th>
                    <th className="border border-slate-400">Fabricante</th>
                    <th className="border border-slate-400">Precio</th>
                </tr>
            </thead>
            <tbody>
            {
                bodegaFiltrado1.map((bode) => (
                    <tr key={bode.codigo_producto}>
                        <td className="border border-slate-400">{bode.codigo_bodega}</td>
                        <td className="border border-slate-400">{bode.codigo_producto}</td>
                        <td className="border border-slate-400">{bode.fecha_aplicacion}</td>
                        <td className="border border-slate-400">{bode.nombre}</td>
                        <td className="border border-slate-400">{bode.marca}</td>
                        <td className="border border-slate-400">{bode.fabricante}</td>
                        <td className="border border-slate-400">{bode.precio}</td>
                    </tr>
                ))

}
            </tbody>
        </table>
        ):bodegaFiltrado2 ? (
            <table  className={` border-separate border-spacing-2 border border-slate-400 transition-all duration-300 ${showForm ? 'mt-10' : 'mt-0'}`}>
            <thead>
                <tr>
                <th className="border border-slate-400">Codigo cuarto frio</th>
                    <th className="border border-slate-400">Capacidad mp3</th>
                    <th className="border border-slate-400">Codigo bodega</th>
                    <th className="border border-slate-400">Temperatura</th>
                    
                </tr>
            </thead>
            <tbody>
            {
                bodegaFiltrado2.map((bode) => (
                    <tr key={bode.codigo_cuarto_frio}>
                        <td className="border border-slate-400">{bode.codigo_cuarto_frio}</td>
                        <td className="border border-slate-400">{bode.capacidad_m3}</td>
                        <td className="border border-slate-400">{bode.codigo_bodega}</td>
                        <td className="border border-slate-400">{bode.temperatura}</td>
                    </tr>
                ))

}
            </tbody>
        </table>

        ):bodegaFiltrado3 ? (
            <table  className={` border-separate border-spacing-2 border border-slate-400 transition-all duration-300 ${showForm ? 'mt-10' : 'mt-0'}`}>
            <thead>
                <tr>
                <th className="border border-slate-400">Codigo bodega</th>
                    <th className="border border-slate-400">Estado</th>
                    <th className="border border-slate-400">Codigo pedido</th>
                    <th className="border border-slate-400">Codigo cliente</th>
                    <th className="border border-slate-400">Fecha pedido</th>
                    <th className="border border-slate-400">Total pedido</th>
                    
                </tr>
            </thead>
            <tbody>
            {
                bodegaFiltrado3.map((bode) => (
                    <tr key={bode.codigo_bodega}>
                        <td className="border border-slate-400">{bode.codigo_bodega}</td>
                        <td className="border border-slate-400">{bode.estado}</td>
                        <td className="border border-slate-400">{bode.codigo_pedido}</td>
                        <td className="border border-slate-400">{bode.codigo_cliente}</td>
                        <td className="border border-slate-400">{bode.fecha_pedido}</td>
                        <td className="border border-slate-400">{bode.total_pedido}</td>
                    </tr>
                ))

}
            </tbody>
        </table>

        ):(
        <table  className={` border-separate border-spacing-2 border border-slate-400 transition-all duration-300 ${showForm ? 'mt-10' : 'mt-0'}`}>

            <thead>
                <tr>
                    <th className="border border-slate-400">Codigo Bodega</th>
                    <th className="border border-slate-400">Capacidad</th>
                </tr>
            </thead>
            <tbody>
            
                {
                    bodegas.length > 0 ? (
                bodegas.map((bode) => (
                    <tr key={bode.codigo_bodega}>
                        <td className="border border-slate-400">{bode.codigo_bodega}</td>
                        <td className="border border-slate-400">{bode.capacidad_total_m3}</td>
                    </tr>
                ))
            ): (
                <tr>
                  <td colSpan="6" className="text-center p-4">No hay productos disponibles</td>
                </tr>
              )
                }
            </tbody>
        </table>
            )}
            </div>
                </div>
                );




};

export default Bodegas;