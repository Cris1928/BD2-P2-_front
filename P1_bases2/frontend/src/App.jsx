import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Cliente from './components/clientes'
import Productos from './components/productos'
import CuartosFrios from './components/CuartosFrios'
import DetallesPedido from './components/DetallesPedido'
import Pedidos from './components/Pedidos'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path='/' element={<Navbar />} />
          <Route path='/clientes' element={<Cliente />} />
          <Route path='/productos' element={<Productos />} />
          <Route path="/cuartosfrios" element={<CuartosFrios />} />
          <Route path="/detallespedido/:codigo_pedido" element={<DetallesPedido />} />
          <Route path="/pedidos" element={<Pedidos />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
