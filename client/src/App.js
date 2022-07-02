import LoginForm from './components/LoginForm';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import Backtester from './components/Backtester';
import Gamer from './components/Gamer';
import GamerLandingPage from './components/GamerLandingPage';
import Navbar from './components/Navbar';
import About from './components/About';
import "./assets/styles/App.css"

const App = () => {
  return (
    <div className='App'>
      <Navbar/>
      <div className='body-content'>
        {/* <Routes>
          <Route exact path="" element={<Backtester />} />
          <Route exact path="/gamer" element={<Gamer />} />
          <Route exact path="/login" element={<LoginForm />} />
          <Route exact path="/signup" element={<RegisterForm />} />
          <Route exact path="/gamerlanding" element={<GamerLandingPage />} />
        </Routes> */}
        <section id='Home'>
          <GamerLandingPage />
        </section>
        <section id='About'>
          <About/>
        </section>
        <section id='Game'>
          <Gamer/>
        </section>
      </div>
    </div>
    )
}

export default App;
