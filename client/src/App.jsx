
import './App.css';
import React, { useState, useEffect, useReducer } from 'react'
import axios from 'axios'
import './styles/tailwind.css'; 
import GenerateJson from './GenerateJson';
import Backchanl from './BackChanlAPI';
import CreateScriptBtn from './CreateScript';
import WebForm from './WebForm';

axios.defaults.baseURL ="https://localhost:8000"

function App() {
 
  
const createTalkStream = async () => {
  try {
    const response = await axios.post('https://localhost:8000/create-talk', {
      script: {
        type: 'text',
        subtitles: 'false',
        provider: {
          type: 'microsoft',
          voice_id: 'en-US-JennyNeural'
        },
        ssml: 'false',
        input: 'This is a story about a story',
      },
      config: {
        fluent: 'false',
        pad_audio: '0.0'
      },
      webhook: '/get-avatar'
    });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

// createTalkStream();

const CreateTalkButton = () => {
  const handleClick = () => {
    const data = {
      script: {
        type: 'text',
        subtitles: 'false',
        provider: {
          type: 'microsoft',
          voice_id: 'en-US-JennyNeural'
        },
        ssml: 'false',
        input: 'This story',
      },
      config: {
        fluent: 'false',
        pad_audio: '0.0'
      },
      webhook: 'https://localhost:8000/webhook',
      source_url: 'https://cdn.discordapp.com/attachments/1117865131272052787/1119006849920934019/jonlarsony_just_one_person_ecb819fc-68db-4c5a-a49f-345273413a79.png'
    };

    axios.post('https://localhost:8000/create-talk', data)
      .then(response => {
        // Handle the successful response here
        console.log('Talk ID:', response.data);
      })
      .catch(error => {
        // Handle any errors that occurred during the request
        console.error(error);
      });
  };

  return (
    <button className="cta text-fancy-rg inline-flex items-center px-6 py-4 mt-8 font-semibold text-white transition-all duration-200 bg-pink-300 hover:bg-pink-400 focus:bg-pink-400" onClick={handleClick}>Create Talk</button>
  );
};


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
//     console.error('Error generating story:', error);
//     throw error;
//   }
// };

// const handleGenerateImage = () => {
//   generateStoryImage(personaName)
// };



  return (
    <div className="App">
      <h1>BACKBOT V2</h1>
      <header className="App-header text-fancy-bold">
        <button onClick={createTalkStream}></button>
        <Backchanl></Backchanl>
        <CreateTalkButton></CreateTalkButton>
        <CreateScriptBtn></CreateScriptBtn>
        {/* <button onClick={handleGenerateImage}>Generate Image</button> */}
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


