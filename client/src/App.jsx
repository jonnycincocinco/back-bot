
import './App.css';
import React, { useState, useEffect, useReducer } from 'react'
import axios from 'axios'
import './styles/tailwind.css'; 
import TranscribeAudio from './TranscribeAudio';

axios.defaults.baseURL ="https://localhost:8000"

function App() {

  return (
    <div className="App">
      <h1 className='text-fancy-rg inline-flex items-center px-6 py-4 mb-8 font-semibold transition-all duration-200'>BACKBOT V3</h1>
      <header className="App-header text-fancy-bold">
        <TranscribeAudio />
      </header>
    </div>
  );
}

export default App;


