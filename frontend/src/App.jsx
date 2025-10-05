import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import NavBar from './components/NavBar.jsx';
import Footer from './components/Footer.jsx';
import Toasts from './components/Toasts.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import BookList from './pages/BookList.jsx';
import BookDetails from './pages/BookDetails.jsx';
import BookForm from './pages/BookForm.jsx';
import './styles.css';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <NavBar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/books" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/books" element={<BookList />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route
              path="/books/new"
              element={
                <ProtectedRoute>
                  <BookForm mode="create" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/books/:id/edit"
              element={
                <ProtectedRoute>
                  <BookForm mode="edit" />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </div>
        <Footer />
        <Toasts />
      </ToastProvider>
    </AuthProvider>
  );
}
