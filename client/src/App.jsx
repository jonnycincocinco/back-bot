
import './App.css';
import React, { useState, useEffect, useReducer } from 'react'
import axios from 'axios'
import './styles/tailwind.css'; 
import GenerateJson from './GenerateJson';
import Backchanl from './BackChanlAPI';
import CreateScriptBtn from './CreateScript';
import CreateAvatar from './CreateAvatar';
import WebForm from './WebForm';
import GenerateImage from './GenerateImage';
import FinalScript from './FinalScript';
import TranscribeAudio from './TranscribeAudio';

axios.defaults.baseURL ="https://localhost:8000"

function App() {


  return (
    <div className="App">
      <h1 className='text-fancy-rg inline-flex items-center px-6 py-4 mb-8 font-semibold transition-all duration-200'>BACKBOT V3</h1>
      <header className="App-header text-fancy-bold">
        {/* <CreateScriptBtn></CreateScriptBtn> */}
        <TranscribeAudio />
        {/* <GenerateImage /> */}
        {/* <CreateAvatar /> */}
        {/* <FinalScript /> */}
        {/* <button className="cta text-fancy-rg inline-flex items-center px-6 py-4 mt-8 font-semibold text-white transition-all duration-200 bg-pink-300 hover:bg-pink-400 focus:bg-pink-400" onClick={handleGenerateImage}>Generate Image</button> */}
        {/* <WebForm/> */}
        {/* <GenerateJson/>   */}
      </header>
    </div>
  );
}

export default App;


