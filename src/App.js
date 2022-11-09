import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Form from './pages/Form';
import Home from './pages/Home';
import Perros from './pages/Perros';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/*' element={<Home/>}/>
          <Route path='/perros' element={<Perros/>}/>
          <Route path='/formulario' element={<Form/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
