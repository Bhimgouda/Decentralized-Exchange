import { Route, Routes } from 'react-router-dom/dist/umd/react-router-dom.development';
import './App.css';
import Swap from './components/Swap';
import Pool from './components/Pool';
import Header from './components/Header';

function App() {
  return (
      <div className='app'>
        <Header />
        <Routes>
          <Route path="/" element={<Swap />}/>
          <Route path="/pool" element={<Pool />}/>
          <Route path="/swap" element={<Swap />}/>
          <Route path="*" element={<Swap />}/>
        </Routes>
      </div>
  );
}

export default App;
