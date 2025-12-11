import React from 'react';
import './App.css';
import AppRouter from './router/AppRouter';
import Toast from './components/common/Toast';

function App() {
  return (
    <div className="App">
      <AppRouter />
      <Toast />
    </div>
  );
}

export default App;
