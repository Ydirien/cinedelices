import './App.css'
import Header from './components/header/Header';
import Footer from './components/footer/Footer'
import HomePage from './pages/homePage/HomePage';
import RecipesPage from './pages/RecipesPage/RecipesPage';
import { Route, Routes } from 'react-router-dom';


function App() {

  return (
    <>
      <Header />
        <main>
        <Routes>
          <Route path='/' element={<HomePage/>} />
          <Route path='/recettes' element={<RecipesPage/>}/>
        </Routes>
        </main>
      <Footer />
    </>
  )
}

export default App
