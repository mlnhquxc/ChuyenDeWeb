import '../assets/styles/App.css';
import Header from './Header';
import Footer from './Footer';
import AppRoutes from '../routes/AppRoutes.jsx';
import { BrowserRouter as Router } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function AppLayout() {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === "";
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
      <>
        {!hideHeaderFooter && <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}
        <AppRoutes />
        {!hideHeaderFooter && <Footer />}
      </>
  );
}
export default AppLayout;