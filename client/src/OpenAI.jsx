import axios from 'axios';

fetch('/api/data')
  .then((response) => response.json())
  .then((data) => {
    // Use the retrieved data in your client-side code
    console.log(data);
  })
  .catch((error) => {
    // Handle errors appropriately
    console.error(error);
  });

// Set up your OpenAI API credentials
const apiUrl = 'https://api.openai.com/v1/images';

// Function to generate an image using the OpenAI Image API
export const generateImage = async (prompt) => {
  try {
    const response = await axios.post(apiUrl, {
      prompt,
      apiKey: process.env.OPENAI_API_KEY,
    });
    // Extract the generated image URL from the API response
    const imageUrl = response.data.url;
    return imageUrl;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};
