import '../assets/styles/App.css';
import Header from '../component/Header';
import Footer from '../component/Footer';
import AppRoutes from '../routes/AppRoutes.jsx'
import AppLayout from '../component/AppLayout.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router> {/* Bọc mọi thứ bên trong Router */}
      <AppLayout />
    </Router>
  );
}

export default App;