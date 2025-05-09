import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import Shop from './pages/Shop';
import Register from './pages/Register';
import Login from './pages/Login';
import CreateProduct from './pages/CreateProduct';
import Profile from './pages/Profile';
import ProductUpdate from './pages/ProductUpdate';

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <ToastContainer />
        <Navbar />
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-product" element={<CreateProduct />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/update-product/:id" element={<ProductUpdate />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}
