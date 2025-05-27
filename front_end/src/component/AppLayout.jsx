import '../assets/styles/App.css';
import Header from '../component/Header';
import Footer from '../component/Footer';
import AppRoutes from '../routes/AppRoutes.jsx';
import { BrowserRouter as Router } from "react-router-dom";
import { useLocation } from 'react-router-dom';

function AppLayout() {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === "";

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <AppRoutes />
      {!hideHeaderFooter && <Footer />}
    </>
  );
}
export default AppLayout;