import LoginForm from './components/LoginForm';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import Backtester from './components/Backtester';
import Gamer from './components/Gamer';
import GamerLandingPage from './components/GamerLandingPage';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <div>
      <Navbar/>
      <div className='pt-5'>
        <Routes>
          <Route exact path="" element={<Backtester />} />
          <Route exact path="/gamer" element={<Gamer />} />
          <Route exact path="/login" element={<LoginForm />} />
          <Route exact path="/signup" element={<RegisterForm />} />
          <Route exact path="/gamerlanding" element={<GamerLandingPage />} />
        </Routes>
      </div>
    </div>
    )
}

export default App;
