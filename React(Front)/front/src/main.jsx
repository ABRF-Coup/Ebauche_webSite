import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router , Routes , Route } from 'react-router-dom';
import Header from './header.jsx';
import Footer from './footer.jsx';
import App from './App.jsx';
import Admin from './components/Admin/admin.jsx';
import ProtectedRoute from './components/Auth/protectedroute.jsx';
import SignIn from './components/Auth/login.jsx';
import SignUp from './components/Auth/register.jsx';
import Logout from './components/Auth/logout.jsx';
import ProductDetail from './components/products/productdetail.jsx';
import Cart from './components/Orders/Cart.jsx';
import Search from './components/products/search.jsx';
import Create from './components/Admin/create.jsx';
import EditPost from './components/Admin/edit.jsx';
import DeletePost from './components/Admin/delete.jsx';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Header />
      <Routes>
        <Route exact path='/' element={<App />} />
        <Route exact path='/admin' element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route exact path='/admin/create' element={<ProtectedRoute><Create /></ProtectedRoute>} />
        <Route exact path="/admin/edit/:id" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
        <Route exact path="/admin/delete/:id" element={<ProtectedRoute><DeletePost /></ProtectedRoute>} />
        <Route exact path="/register" element={<SignUp />} />
        <Route exact path="/login" element={<SignIn />} />
        <Route exact path="/logout" element={<Logout />} />
        <Route exact path='/product/:slug' element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
        <Route exact path='/cart' element={<ProtectedRoute><Cart/></ProtectedRoute>} />
        <Route exact path='/search' element={<Search />} />


      </Routes>
      <Footer />
    </Router>
    
  </StrictMode>,
)
