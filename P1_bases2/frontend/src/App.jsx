import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Cliente from './components/clientes'
import Productos from './components/productos'
import CuartosFrios from './components/CuartosFrios'
import DetallesPedido from './components/DetallesPedido'
import Pedidos from './components/Pedidos'
import Bodegas from './components/bodegas'
import Home from './components/Home'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path='/' element={<Home />} />
          <Route path='/clientes' element={<Cliente />} />
          <Route path='/productos' element={<Productos />} />
          <Route path="/cuartosfrios" element={<CuartosFrios />} />
          <Route path="/detallespedido/:codigo_pedido" element={<DetallesPedido />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path='/bodegas' element={<Bodegas/>} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
