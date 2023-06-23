
import './App.css';
import React, { useState, useEffect, useReducer } from 'react'
import axios from 'axios'
import './styles/tailwind.css'; 
import GenerateJson from './GenerateJson';
import Backchanl from './BackChanlAPI';
import CreateScriptBtn from './CreateScript';
import CreateAvatar from './CreateAvatar';
import WebForm from './WebForm';

axios.defaults.baseURL ="https://localhost:8000"

function App() {

let personaStoryPrompt = 'The Materialist';

const createScript = async () => {
  try {
    const response = await fetch('http://localhost:8000/generate-script', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ personaStoryPrompt }),
    });

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error generating story:', error);
  } 
};

// useEffect(() => {
//   createScript();
// }, [personaStoryPrompt]);

const personaName = "driverless cars";

// useEffect(() => {
//   generateStoryImage(personaName)
//     .then(imageData => {
//       // Handle the generated image data
//       console.log(imageData);

//       // Access the generated image URL
//       const imageUrl = imageData.output[0]; // Assuming there is only one image URL in the output array

//       // Store the image URL in your persona object or variable
//       const persona = {
//         name: personaName,
//         imageUrl: imageUrl,
//         // Other persona properties
//       };

//       // Use the persona object or variable later in your code
//       console.log('img', persona.imageUrl); // Example usage

//       // Set the imageUrl state variable
//       // setImageUrl(imageUrl);
//     })
//     .catch(error => {
//       // Handle the error
//       console.error(error);
//     });
// }, [personaName]);

// const generateStoryImage = async personaName => {
//   try {
//     const response = await axios.post('/generate-story-image', { personaName });
//     return response.data;
//   } catch (error) {
//     console.error('Error generating image:', error);
//     throw error;
//   }
// };

// const handleGenerateImage = () => {
//   generateStoryImage(personaName)
// };



  return (
    <div className="App">
      <h1 className=''>BACKBOT V3</h1>
      <header className="App-header text-fancy-bold">
        <Backchanl></Backchanl>
        <CreateScriptBtn></CreateScriptBtn>
        <CreateAvatar></CreateAvatar>
        {/* <button className="cta text-fancy-rg inline-flex items-center px-6 py-4 mt-8 font-semibold text-white transition-all duration-200 bg-pink-300 hover:bg-pink-400 focus:bg-pink-400" onClick={handleGenerateImage}>Generate Image</button> */}
        <WebForm/>
        {/* <GenerateJson/>   */}
        <a href="#" title="" className="cta text-fancy-rg inline-flex items-center px-6 py-4 mt-8 font-semibold text-white transition-all duration-200 bg-pink-300 hover:bg-pink-400 focus:bg-pink-400" role="button">
          <button>
          Make Videoz
        </button>
        </a>

        {/* <div>Videoz status : </div> */}
      </header>
    </div>
  );
}

export default App;


