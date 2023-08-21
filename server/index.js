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
app.use(express.json());
app.use(bodyParser.json());
const fetch = require('node-fetch');
const Replicate = require('replicate');
const path = require('path');

const https = require('https');
const fs = require('fs');
const options = {
  key: fs.readFileSync('/Users/jonathanlarson/localhost-key.pem'),
  cert: fs.readFileSync('/Users/jonathanlarson/localhost.pem')
};

app.use(cors());

app.use(express.static(path.join(__dirname,"../dist")));

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
      max_tokens: 1024,
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
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const audioUrl = req.body.audioUrl; // Assuming the audio URL is provided in the request body
    const model = 'whisper-1';

    // Download the audio file
    const audioFilePath = path.join(__dirname, 'temp', 'audio.mp3');
    const downloadResponse = await axios.get(audioUrl, { responseType: 'stream' });
    downloadResponse.data.pipe(fs.createWriteStream(audioFilePath));

    // Wait for the audio file to finish downloading
    await new Promise((resolve) => {
      downloadResponse.data.on('end', resolve);
    });

    const formData = new FormData();
    formData.append('model', model);
    formData.append('file', fs.createReadStream(audioFilePath));
    formData.append('language', 'en');



    const transcriptionResponse = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        ...formData.getHeaders(),
      },
    });

    const transcript = transcriptionResponse.data.text;

    // Return the transcript in the response

    // Generate VTT file
    const vttFilePath = path.join(__dirname, 'temp', 'transcript.vtt');
    const vttContent = `WEBVTT\n\n${transcript.vtt}`;
    fs.writeFileSync(vttFilePath, vttContent);

    // Return the transcript and VTT file URL in the response
    res.json({
      transcript,
      vttDownloadUrl: `/download/${path.basename(vttFilePath)}`,
    });

    console.log('Transcription:', transcript);
  } catch (error) {
    console.error('Error transcribing audio:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});


// app.post('/transcribe', async (req, res) => {
//   try {
//     const { audioUrl } = req.body;
// 0
//     if (!audioUrl) {
//       throw new Error('No audio URL provided');
//     }

//     const modelId = 'openai/whisper:91ee9c0c3df30478510ff8c8a3a545add1ad0259ad3a9f78fba57fbc05ee64f7';

//     const output = await replicate.run(
//       "openai/whisper:91ee9c0c3df30478510ff8c8a3a545add1ad0259ad3a9f78fba57fbc05ee64f7",
//       {
//         input: {
//           audio: audioUrl,
//         },
//         webhook: "https://localhost:8000/webhook",
//         language: "en",
//       }
//     );

//     const transcript = output.transcription;

//     res.json({
//       transcript,
//     });

//     // console.log('Transcription:', transcript);
//   } catch (error) {
//     console.error('Error transcribing audio:', error);
//     res.status(500).json({ error: 'Failed to transcribe audio' });
//   }
// });

app.post('/generate-video-zero', async (req, res) => {
  try {

    const { prompt } = req.body;

    const output = await replicate.run(
        "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      {
        input: {
          prompt: 'cinematic ' + prompt,
          num_frames: 24,
          negative_prompt: "very blue, dust, noisy, washed out, ugly, distorted, broken",
          fps: 24,
          model: '576w',
          guidance_scale: 17.5,
          width: 1024,
          height: 576,
        },
        webhook: "https://localhost:8000/webhook",
        language: "en",
      }
    );


    res.json(output);

    console.log('Output:', output);
  } catch (error) {
    console.error('Error generating video:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

app.post('/generate-video-def', async (req, res) => {
  try {

    const { prompt } = req.body;

    const output = await replicate.run(
        // "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      "deforum-art/deforum-stable-diffusion:1a98303504c7d866d2b198bae0b03237eab82edc1491a5306895d12b0021d6f6",
      {
        input: {
          model_checkpoint: "Protogen_V2.2.ckpt",
          // prompt: prompt + ", beautiful, 8k, perfect, award winning,",
          // num_frames: 2,
          animation_prompts: prompt,
          fov: 40,
          fps: 15,
          max_frames: 80,
        },
        webhook: "https://localhost:8000/webhook",
        language: "en",
      }
    );


    res.json(output);

    console.log('Output:', output);
  } catch (error) {
    console.error('Error generating video:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

app.post('/generate-image-sdxl', async (req, res) => {
  try {

    const { prompt } = req.body;

    const output = await replicate.run(
        "stability-ai/sdxl:2b017d9b67edd2ee1401238df49d75da53c523f36e363881e057f5dc3ed3c5b2",
      {
        input: {
          prompt: prompt,
          image: "https://f4.bcbits.com/img/a0483269192_16.jpg", 
          refine: "base_image_refiner",
          scheduler: "KarrasDPM",
          mask: "https://replicate.delivery/pbxt/JF3Ld3yPLVA3JIELHx1uaAV5CQOyr4AoiOfo6mJZn2fofGaT/dog-mask.png",
        },
        webhook: "https://localhost:8000/webhook",
        language: "en",
      }
    );


    res.json(output);

    console.log('Output:', output);
  } catch (error) {
    console.error('Error generating video:', error);
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

    // console.log('Transcription:', transcript);
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



app.post('/generate-story-image-v1', async (req, res) => {
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
      prompt: `image of 1950s 1960s color photo Florida postcard, scifi otherworldly in ocala national forest facepaint cryptid offputting interdimensional divine feminine ritualistic ethereal eerie truecreepy cups nature photography 35mm film --ar 16:9, ${personaName}`,
      negative_prompt: "((words)), nsfw, sexy, no other people, group of people, underwear, (((naked))), (((exposed breasts))), ((bikini)), extra legs, extra hands, extra arms, words, names, text, ((out of frame)), ((extra fingers)), mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), (((tiling))), ((tile)), ((fleshpile)), ((ugly)), (((abstract))), blurry, ((bad anatomy)), ((bad proportions)), ((extra limbs)), cloned face, (((skinny))), glitchy, ((double torso)), ((extra arms)), ((extra hands)), ((mangled fingers)), (missing lips), ((ugly face)), ((fat)), ((extra legs)), anime",
      init_image: 'https://cdn.discordapp.com/attachments/1074534563986030656/1114786778252058744/jonlarsony_album_cover_0674df6a-9a46-4897-8ccf-b8d43e978de9.png', 
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

app.post('/generate-story-image-v2', async (req, res) => {
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
      prompt: `image of 1950s 1960s color photo Florida postcard, scifi otherworldly in ocala national forest facepaint cryptid offputting interdimensional divine feminine ritualistic ethereal eerie truecreepy cups nature photography 35mm film --ar 16:9, ${personaName}`,
      negative_prompt: "((words)), nsfw, sexy, no other people, group of people, underwear, (((naked))), (((exposed breasts))), ((bikini)), extra legs, extra hands, extra arms, words, names, text, ((out of frame)), ((extra fingers)), mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), (((tiling))), ((tile)), ((fleshpile)), ((ugly)), (((abstract))), blurry, ((bad anatomy)), ((bad proportions)), ((extra limbs)), cloned face, (((skinny))), glitchy, ((double torso)), ((extra arms)), ((extra hands)), ((mangled fingers)), (missing lips), ((ugly face)), ((fat)), ((extra legs)), anime",
      init_image: 'https://cdn.discordapp.com/attachments/1124548031786799114/1127789237375352892/jonlarsony_1950s_color_photo_of_a_ancient_bird_that_has_a_great_250b688a-6415-46c7-ba82-4001cefb2de3.png', 
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

app.post('/generate-story-image-v3', async (req, res) => {
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
      prompt: `image of a future design --ar 16:9, ${personaName}`,
      negative_prompt: "((words)), nsfw, sexy, no other people, group of people, underwear, (((naked))), (((exposed breasts))), ((bikini)), extra legs, extra hands, extra arms, words, names, text, ((out of frame)), ((extra fingers)), mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), (((tiling))), ((tile)), ((fleshpile)), ((ugly)), (((abstract))), blurry, ((bad anatomy)), ((bad proportions)), ((extra limbs)), cloned face, (((skinny))), glitchy, ((double torso)), ((extra arms)), ((extra hands)), ((mangled fingers)), (missing lips), ((ugly face)), ((fat)), ((extra legs)), anime",
      init_image: 'https://cdn.discordapp.com/attachments/1120216639611351183/1120929112794603623/Screen_Shot_2023-06-20_at_9.10.54_PM.png', 
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


app.post('/generate-story-image-v4', async (req, res) => {
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
      prompt: `image of a future design --ar 16:9, ${personaName}`,
      negative_prompt: "((words)), nsfw, sexy, no other people, group of people, underwear, (((naked))), (((exposed breasts))), ((bikini)), extra legs, extra hands, extra arms, words, names, text, ((out of frame)), ((extra fingers)), mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), (((tiling))), ((tile)), ((fleshpile)), ((ugly)), (((abstract))), blurry, ((bad anatomy)), ((bad proportions)), ((extra limbs)), cloned face, (((skinny))), glitchy, ((double torso)), ((extra arms)), ((extra hands)), ((mangled fingers)), (missing lips), ((ugly face)), ((fat)), ((extra legs)), anime",
      init_image: 'https://d1htavafy9m5bl.cloudfront.net/eyJidWNrZXQiOiJwcm9kLXNpaC5zZWV0aWNrZXRzdXNhLnVzIiwia2V5IjoiOTQwYWM0YWYtYmFhYi00ZmI5LWI4MTgtNDMyZjgwZjJlMzY1IiwiZWRpdHMiOnt9fQ==', 
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

app.post('/generate-story-image-v5', async (req, res) => {
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
      prompt: `image of a goth design --ar 16:9, ${personaName}`,
      negative_prompt: "((words)), nsfw, sexy, no other people, group of people, underwear, (((naked))), (((exposed breasts))), ((bikini)), extra legs, extra hands, extra arms, words, names, text, ((out of frame)), ((extra fingers)), mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), (((tiling))), ((tile)), ((fleshpile)), ((ugly)), (((abstract))), blurry, ((bad anatomy)), ((bad proportions)), ((extra limbs)), cloned face, (((skinny))), glitchy, ((double torso)), ((extra arms)), ((extra hands)), ((mangled fingers)), (missing lips), ((ugly face)), ((fat)), ((extra legs)), anime",
      init_image: 'https://f4.bcbits.com/img/a1209677761_16.jpg', 
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
