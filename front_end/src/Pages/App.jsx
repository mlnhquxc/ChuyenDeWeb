import '../assets/styles/App.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AppRoutes from '../routes/AppRoutes.jsx'
import AppLayout from '../components/AppLayout.jsx';
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
import { ToastContainer } from "react-toastify";

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <WishlistProvider>
                        <AppLayout />
                        <ToastContainer
                            position="top-right"
                            autoClose={3000}
                            hideProgressBar={false}
                            newestOnTop
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="light"
                        />
                    </WishlistProvider>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;