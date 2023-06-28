import React, { useState } from 'react';
import PromptForm from './PromptForm';


const FinalScript = () => {
  const [personaStoryPrompt, setPersonaStoryPrompt] = useState('');
  const [finalScriptData, setFinalScriptData] = useState('');

  const [promptField1, setPromptField1] = useState('');
const [promptField2, setPromptField2] = useState('');
const [promptField3, setPromptField3] = useState('');
const [promptField4, setPromptField4] = useState('');
const [promptField5, setPromptField5] = useState('');
const [promptField6, setPromptField6] = useState('');

  const handleClick = () => {
    try {
      const sentences = [
        promptField1,
        promptField2,
        promptField3,
        promptField4,
        promptField5,
        promptField6
      ];
  
      const sentencesData = sentences.map((sentence) => ({ sentence }));
      const jsonData = JSON.stringify(sentencesData, null, 2);
  
      // Show output on the page
      const outputElement = document.getElementById('output');
      outputElement.innerText = jsonData;
  
      // Set script data state
      setFinalScriptData(jsonData);
  
      // Create JSON file
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
  
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sentences.json';
  
      document.body.appendChild(a);
      a.click();
  
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating script:', error);
    }
  };
  
  
  const handleInputChange = (event) => {
    setPersonaStoryPrompt(event.target.value);
  };

  return (
    <div>
      <div className='create-avatar mt-20'>
     
      <form>
      <textarea
  cols="80" rows="2"
  type="text"
  id="promptField1"
  value={promptField1}
  onChange={(event) => setPromptField1(event.target.value)}
  placeholder=""
/>
<textarea
  cols="80" rows="2"
  type="text"
  id="promptField2"
  value={promptField2}
  onChange={(event) => setPromptField2(event.target.value)}
  placeholder=""
/>
<textarea
  cols="80" rows="2"
  type="text"
  id="promptField3"
  value={promptField3}
  onChange={(event) => setPromptField3(event.target.value)}
  placeholder=""
/>
<textarea
  cols="80" rows="2"
  type="text"
  id="promptField4"
  value={promptField4}
  onChange={(event) => setPromptField4(event.target.value)}
  placeholder=""
/>
<textarea
  cols="80" rows="2"
  type="text"
  id="promptField5"
  value={promptField5}
  onChange={(event) => setPromptField5(event.target.value)}
  placeholder=""
/>
<textarea
  cols="80" rows="2"
  type="text"
  id="promptField6"
  value={promptField6}
  onChange={(event) => setPromptField6(event.target.value)}
  placeholder=""
/>

      </form>
      <button className="cta text-fancy-rg inline-flex items-center px-6 py-4 mt-8 font-semibold text-white transition-all duration-200 bg-pink-300 hover:bg-pink-400 focus:bg-pink-400" onClick={handleClick}>Generate Final Script</button>
      
    </div>
    <div className='mt-10 text-left' id="output">{finalScriptData}</div>
    </div>
  );
};

export const getFinalScriptData = () => {
  return finalScriptData;
};

export default FinalScript;

