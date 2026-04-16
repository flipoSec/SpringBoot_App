import {BrowserRouter,Routes, Route} from 'react-router-dom';
import {AuthProvider} from '../context/AuthContext'
import ProtectedRoute from '../components/common/ProtectedRoute';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

import Home          from '../pages/public/Home';
import Products      from '../pages/public/Products';
import ProductDetail from '../pages/public/ProductDetail';
import Profile       from '../pages/public/Profile';
import Login         from '../pages/auth/Login';
import Register      from '../pages/auth/Register';
// import Dashboard         from '../pages/admin/Dashboard';
// import ManageProducts    from '../pages/admin/ManageProducts';
// import ManageCategories  from '../pages/admin/ManageCategories';
// import ManageUsers       from '../pages/admin/ManageUsers';

export default function AppRouter() {
    return(
        <BrowserRouter>
            <AuthProvider>
                <Navbar/>
                <Routes>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/products' element={<Products/>}/>
                    <Route path='/products/:id' element={<ProductDetail/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/register' element={<Register/>}/>

                    {/* <Route path='/profile' element={
                        <ProtectedRoute requireAuth>
                            <Profile></Profile>
                    </ProtectedRoute>}/>
                
                    <Route path="/admin" element={
                        <ProtectedRoute requireAuth requireAdmin>
                        <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/products" element={
                        <ProtectedRoute requireAuth requireAdmin>
                        <ManageProducts />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/categories" element={
                        <ProtectedRoute requireAuth requireAdmin>
                        <ManageCategories />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/users" element={
                        <ProtectedRoute requireAuth requireAdmin>
                        <ManageUsers />
                        </ProtectedRoute>
                    } /> */}
                </Routes>
                <Footer />
            </AuthProvider>
        </BrowserRouter>
    );
}

