// scriptService.js
export const createScript = async (personaStoryPrompt) => {
  try {
    const response = await fetch('https://localhost:8000/generate-script', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ personaStoryPrompt }),
    });

    const data = await response.json();
    console.log(personaStoryPrompt);
    console.log(data);

    if (!data.story) {
      console.error('Invalid sentence data:', data);
      return [];
    }

    const sentences = data.story.split('.').map(sentence => sentence.trim());
    return sentences;
  } catch (error) {
    console.error('Error generating story:', error);
    return [];
  }
};
