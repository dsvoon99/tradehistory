import LoginForm from './components/LoginForm';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import Backtester from './components/Backtester';
import Gamer from './components/Gamer';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="" element={<Backtester />} />
        <Route exact path="/gamer" element={<Gamer />} />
        <Route exact path="/login" element={<LoginForm />} />
        <Route exact path="/signup" element={<RegisterForm />} />
      </Routes>
    </BrowserRouter>
    )
}

export default App;
