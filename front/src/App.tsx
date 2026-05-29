import './App.css'
import Header from './components/header/Header';
import Footer from './components/footer/Footer'
import HomePage from './pages/homePage/HomePage';
import { Route, Routes } from 'react-router-dom';


function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage/>} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
