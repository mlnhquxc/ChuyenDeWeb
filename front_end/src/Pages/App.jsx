import '../assets/styles/App.css';
import Header from '../component/Header';
import Footer from '../component/Footer';
import AppRoutes from '../routes/AppRoutes.jsx'
import AppLayout from '../component/AppLayout.jsx';
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from '../context/AuthContext';
import { WishlistProvider } from '../context/WishlistContext';
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Router>
      <AuthProvider>
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
      </AuthProvider>
    </Router>
  );
}

export default App;