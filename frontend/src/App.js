
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import SecondPage from './components/SecondPage';
import Header from './components/Header';
import './App.css';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/states" element={<SecondPage />} />
      </Routes>
    </>
  );
}

export default App;
