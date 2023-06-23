const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
require('dotenv').config({ path: '../.env' });
const axios = require('axios');
const FormData = require('form-data');
const qs = require('querystring');
const sdk = require('api')('@d-id/v4.2.0#az5qqc32livq5e2n');
const app = express();
app.use(cors());
app.use(bodyParser.json());
const fetch = require('node-fetch');


const https = require('https');
const fs = require('fs');
const options = {
  key: fs.readFileSync('/Users/jonathanlarson/localhost-key.pem'),
  cert: fs.readFileSync('/Users/jonathanlarson/localhost.pem')
};

app.get('/backchanl-api', (req, res) => {
  const response = {
    question: 'Should Elon continue to be Twitter CEO?',
    urls: ['https://newz.com', 'https://morenewz.org', 'https://evenmoernuz.net']
  };

  res.json(response);
  console.log(response);
});

app.post('/generate-script', async (req, res) => {
  try {
    // Get transaction data from the request body, e.g., req.body.transactions
    const { personaStoryPrompt } = req.body;

    if (!personaStoryPrompt) {
      throw new Error('Invalid persona name');
    }

    // Generate the story based on transaction data
    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const prompt = `\n${personaStoryPrompt}\:`;
    
    const aiResponse = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // Extract the generated story from the OpenAI API response
    // const generatedStory = aiResponse.data.choices[0].text;
    const generatedStory = aiResponse.data.choices[0].text;


    // Return the generated story and image URL as the response
    res.json({ story: generatedStory });
  } catch (error) {
    console.error('Error generating story:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


const AUTH_TOKEN = process.env.AUTH_TOKEN; // Retrieve authorization token from environment variable

// Handle the initial POST request
app.post('/create-talk', (req, res) => {
  try {
    sdk.auth(AUTH_TOKEN); // Authenticate with the provided authorization token

    sdk.createTalk({
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
      webhook: 'https://localhost:8000/webhook',
      source_url: 'https://cdn.discordapp.com/attachments/1117865131272052787/1119006849920934019/jonlarsony_just_one_person_ecb819fc-68db-4c5a-a49f-345273413a79.png'
    })
      .then(({ data }) => res.json(data.id))
      .catch(error => {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/webhook', (req, res) => {
  const talkId = req.body; // Assuming the talk ID is included in the request body
  console.log(talkId);
  // Handle the webhook request and retrieve the necessary information
  // Perform any required operations with the talk ID
  
  res.sendStatus(200); // Send a success response to the webhook request
});


// Handle the webhook request separately
app.get('/get-video', (req, res) => {
  // Process the GET request here and retrieve the source_url
  const sourceUrl = req.query.source_url;
  console.log(sourceUrl);
  // Return the source_url in the response
  res.json({ source_url: sourceUrl });
});




app.post('/generate-story-image', async (req, res) => {
  try {
    const { personaName } = req.body;

    if (!personaName) {
      throw new Error('Invalid persona name');
    }

    const formData = qs.stringify({
      key: process.env.STABLEDIFFUSION_API_KEY,
      // model: 'midjourney-v4-painta',
      // model: 'midjourney-papercut',
      model: 'midjourney',
      prompt: `image of ${personaName}`,
      negative_prompt: "((words)), ((out of frame)), ((extra fingers)), mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), (((tiling))), ((naked)), ((tile)), ((fleshpile)), ((ugly)), (((abstract))), blurry, ((bad anatomy)), ((bad proportions)), ((extra limbs)), cloned face, (((skinny))), glitchy, ((extra breasts)), ((double torso)), ((extra arms)), ((extra hands)), ((mangled fingers)), ((missing breasts)), (missing lips), ((ugly face)), ((fat)), ((extra legs)), anime",
      width: "512",
      height: "512",
      samples: "1",
      num_inference_steps: "20",
      seed: null,
      guidance_scale: 7.5,
      scheduler: "UniPCMultistepScheduler",
      webhook: null,
      track_id: null,
    });

    const response = await axios.post('https://stablediffusionapi.com/api/v3/text2img', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error generating story:', error);
    res.status(500).json({ error: 'Failed to generate story' });
  }
});




https.createServer(options, app).listen(8000, () => {
  // console.log('Server is running on https://localhost:8000');
});

// ./nexrender-cli-macos --file back-bot/output.json
