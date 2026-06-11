import './App.css';
import { useEffect } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import RecipesPage from './pages/RecipesPage/RecipesPage';
import RecipePage from './pages/RepicePage/Recipe';
import { Route, Routes, Navigate } from 'react-router-dom';
import MentionsLegales from './pages/MentionsPage/MentionsPage';
import Confidentialite from './pages/ConfidentialPage/ConfidentialPage';
import logoMain from '../public/Logo/LOGO_pricipal_allonger.png';
import Register from './pages/Auth/register/Register';
import Login from './pages/Auth/login/login';
import Passwordlost from './pages/Auth/passwordlost/passwordlost';
import SearchPage from './pages/SearchPage/SearchPage';
import CreatRecipe from './pages/CreateRecipe/CreateRecipe';
import AdminDashboardPage from './pages/AdminDashboardPage/AdminDashboardPage';
import { API_URL } from './constants';
import { AuthProvider } from '../context/AuthContext/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AdminRecipesPage from './pages/AdminRecipesPage/AdminRecipesPage';
import AdminRecipeDetailPage from './pages/AdminRecipeDetailPage/AdminRecipeDetailPage';
import AdminRecipeCreatePage from './pages/AdminRecipeCreatePage/AdminRecipeCreatePage';
import ProfilePage from './pages/ProfilePage/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <Header logoMain={logoMain} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recettes" element={<RecipesPage />} />
          <Route path="/recettes/:recette" element={<RecipePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/confidentialite" element={<Confidentialite />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/passwordlost" element={<Passwordlost />} />
          <Route
            path="/profil"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreatRecipe />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/recipes" element={<AdminRecipesPage />} />
          <Route path="/admin/recipes/new" element={<AdminRecipeCreatePage />} />
          <Route path="/admin/recipes/:id" element={<AdminRecipeDetailPage />} />
        </Routes>
      </main>
      <Footer />
    </AuthProvider>
  );
}

export default App;
