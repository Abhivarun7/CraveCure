import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./components/login/Login";
import Signup from "./components/signUp/Signup";
import Index from "./components/main/Index";
import Order from './components/restaurants/Order'; // Assuming Order component is in the order folder
import Dishes from './components/dishes/Dishes';
import Prevorders from './components/previous-orders/PrevOrders';

const App = () => {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/index" element={token ? <Index /> : <Navigate to="/login" />} />
          <Route path="/order/:id" element={token ? <Order /> : <Navigate to="/login" />} />
          <Route path="/dish/" element={token ? <Dishes /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/prevOrder" element={token ? <Prevorders /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
