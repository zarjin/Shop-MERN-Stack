import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from './context/UserContext';
import { ProductProvider } from './context/ProductContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import Shop from './pages/Shop';
import Register from './pages/Register';
import Login from './pages/Login';
import CreateProduct from './pages/CreateProduct';
import Profile from './pages/Profile';
import ProductUpdate from './pages/ProductUpdate';
import Admin from './pages/Admin';
import Cart from './pages/Cart';

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <SocketProvider>
          <ProductProvider>
            <ToastContainer />
            <Navbar />
            <Routes>
              <Route path="/" element={<Shop />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/create-product" element={<CreateProduct />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/update-product/:id" element={<ProductUpdate />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </ProductProvider>
        </SocketProvider>
      </UserProvider>
    </BrowserRouter>
  );
}
