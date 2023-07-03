import React, { useState } from 'react';

const CreateScript = ({ personaStoryPrompt }) => {
  const [scriptData, setScriptData] = useState('');

  const handleClick = async () => {
    try {
      // Create script using personaStoryPrompt
      const response = await fetch('https://localhost:8000/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ personaStoryPrompt }),
      });

      const data = await response.json();
      console.log(personaStoryPrompt);
      console.log(data.story);

      if (!data.story) {
        console.error('Invalid sentence data:', data);
        return;
      }

      const sentences = data.story.split('.').map(sentence => sentence.trim());
      const sentencesData = sentences.map(sentence => ({ sentence }));
      const jsonData = JSON.stringify(sentencesData, null, 2);

      // Show output on the page
      const outputElement = document.getElementById('output');
      outputElement.innerText = jsonData;

      // Set script data state
      setScriptData(data.story);

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
      console.error('Error generating story:', error);
    }
  };

  const handleInputChange = (event) => {
    setPersonaStoryPrompt(event.target.value);
  };

  return (
    <div>
      <div className='create-avatar'>
      <p className='white text-left'> </p>
      <form>
      <textarea
        cols="80" rows="20"
        type="text"
          value={personaStoryPrompt}
          onChange={handleInputChange}
          placeholder="Enter persona story prompt"
        />
      </form>
      <button className="cta text-fancy-rg inline-flex items-center px-6 py-4 mt-8 font-semibold text-white transition-all duration-200 bg-pink-300 hover:bg-pink-400 focus:bg-pink-400" onClick={handleClick}>Generate Script</button>
      
    </div>
    <div className='mt-10 text-left' id="output">{scriptData}</div>
    </div>
  );
};

export const getScriptData = () => {
  return scriptData;
};

export default CreateScript;

