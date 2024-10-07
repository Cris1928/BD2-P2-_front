import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Cliente from './components/clientes'
import Productos from './components/productos'
import Home from './components/Home'
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
            {/* Ruta para la página de Login */}
            <Route path='/' element={<Home/>} />
            <Route path='/clientes' element={<Cliente/>} />
            <Route path='/productos' element={<Productos/>} />
            

            
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
