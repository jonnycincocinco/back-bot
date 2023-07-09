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
app.use(express.json());
app.use(bodyParser.json());
const fetch = require('node-fetch');
const Replicate = require('replicate');

const https = require('https');
const fs = require('fs');
const options = {
  key: fs.readFileSync('/Users/jonathanlarson/localhost-key.pem'),
  cert: fs.readFileSync('/Users/jonathanlarson/localhost.pem')
};

// app.use(express.static(path.join(__dirname,"../build")));

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

const replicate = new Replicate({
  auth: process.env.REACT_APP_REPLICATE_API_TOKEN,
  fetch: fetch,
});

app.post('/transcribe', async (req, res) => {
  try {
    const { audioUrl } = req.body;

    if (!audioUrl) {
      throw new Error('No audio URL provided');
    }

    const modelId = 'openai/whisper:91ee9c0c3df30478510ff8c8a3a545add1ad0259ad3a9f78fba57fbc05ee64f7';

    const output = await replicate.run(
      "openai/whisper:91ee9c0c3df30478510ff8c8a3a545add1ad0259ad3a9f78fba57fbc05ee64f7",
      {
        input: {
          audio: audioUrl,
        },
        webhook: "https://localhost:8000/webhook",
        language: "en",
      }
    );

    const transcript = output.transcription;

    res.json({
      transcript,
    });

    // console.log('Transcription:', transcript);
  } catch (error) {
    console.error('Error transcribing audio:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

app.post('/transcribe-segments', async (req, res) => {
  try {
    const { audioUrl } = req.body;

    if (!audioUrl) {
      throw new Error('No audio URL provided');
    }

    const modelId = 'openai/whisper:91ee9c0c3df30478510ff8c8a3a545add1ad0259ad3a9f78fba57fbc05ee64f7';

    const output = await replicate.run(
      "openai/whisper:91ee9c0c3df30478510ff8c8a3a545add1ad0259ad3a9f78fba57fbc05ee64f7",
      {
        input: {
          audio: audioUrl,
        },
        webhook: "https://localhost:8000/webhook",
        language: "en",
      }
    );

    const transcript = output.segments;

    res.json({
      transcript,
    });

    console.log('Transcription:', transcript);
  } catch (error) {
    console.error('Error transcribing audio:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

app.post('/webhook', (req, res) => {
  // Handle the incoming webhook request
  const { data } = req.body;
  console.log(data)
  // Process the data from the webhook payload
  // Extract relevant information and perform necessary actions

  // Send a response back to the webhook request
  res.status(200).send('Webhook received successfully');
});


const AUTH_TOKEN = process.env.AUTH_TOKEN; // Retrieve authorization token from environment variable

// Handle the initial POST request
app.post('/create-talk', async (req, res) => {
  try {
    const { personaStoryPrompt } = req.body;

    sdk.auth(AUTH_TOKEN); // Authenticate with the provided authorization token

    const data = {
      script: {
        type: 'text',
        subtitles: 'false',
        provider: {
          type: 'microsoft',
          voice_id: 'en-US-JennyNeural'
        },
        ssml: 'false',
        input: personaStoryPrompt,
      },
      config: {
        fluent: 'false',
        pad_audio: '0.0'
      },
      face: {
        top_left: [
          0,
          0
        ],
        size: 512
      },
      webhook: 'https://webhook.site/ea99fa36-a680-4dbf-a792-ded93a601d86',
      source_url: 'https://cdn.discordapp.com/attachments/1109987621121302548/1122658169781485809/avatar.png'
    };

    const response = await sdk.createTalk(data);
    const talkId = response.data.id;

    res.json(talkId);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// app.post('/webhook', (req, res) => {
//   const talkId = req.body; // Assuming the talk ID is included in the request body
//   console.log(talkId);
//   // Handle the webhook request and retrieve the necessary information
//   // Perform any required operations with the talk ID
  
//   res.sendStatus(200); // Send a success response to the webhook request
// });


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
      negative_prompt: "((words)), nsfw, sexy, no other people, group of people, underwear, (((naked))), (((exposed breasts))), ((bikini)), extra legs, extra hands, extra arms, words, names, text, ((out of frame)), ((extra fingers)), mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), (((tiling))), ((tile)), ((fleshpile)), ((ugly)), (((abstract))), blurry, ((bad anatomy)), ((bad proportions)), ((extra limbs)), cloned face, (((skinny))), glitchy, ((double torso)), ((extra arms)), ((extra hands)), ((mangled fingers)), (missing lips), ((ugly face)), ((fat)), ((extra legs)), anime",
      init_image: 'https://cdn.discordapp.com/attachments/1124548031786799114/1125526895958687834/jonlarsony_1950s_color_photo_Florida_postcard_of_extradimension_ffaa9e93-b29e-412b-b626-424a457c30d1.png', 
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

    const response = await axios.post('https://stablediffusionapi.com/api/v3/img2img', formData, {
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

// ./nexrender-cli-macos --file back-bot/backbot.json
