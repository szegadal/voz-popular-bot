import fs from 'fs';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function transcribeAudioOpenAI (audioFilePath: string) {
  try {
    console.log('Calling transcribeAudioOpenAI');

    const audioFileStream = fs.createReadStream(audioFilePath);
    audioFileStream.on('error', (err) => {
      console.log('File Error', err);
    })
    const audioFile: File = audioFileStream as unknown as File;


    const audioRes = await openai.createTranscription(audioFile, "whisper-1", "es");
    return audioRes.data.text;

  } catch (err: any) {
    if (err.isAxiosError) {
      console.log('Error from Axios', err.response?.data);
    }
    err.name = 'transcribeAudioOpenAIException';
    throw err;
  }
}

export async function chatGPTanalyzeTextSentiment (textToAnalize:string) {

  const responseInstructions =
    "I'm passing you an audio transcription. I need you to answer in JSON and fill the given fields: age (string), name (string), sex ('m' for male or 'f' for female or 'na'), tags (object). On 'tags' field you have the given options: sentiment ('pro gobierno' or 'contra gobierno' or 'na'), governmentLevel ('municipal' or 'nacional' or 'na'), isOffensive (boolean), isDiscriminatory (boolean). Determine the sex from the name of the person who sent the audio. Use 'true' in isOffensive if the message has offensife language, and 'true' in isDiscriminatory if it has discriminatory language or connotations. Use 'na' for not available or undefined";
  const openAICompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "user", content: responseInstructions },
      { role: "user", content: textToAnalize },
    ],
    temperature: 0.2,
  });
  if (!openAICompletion.data.choices[0].message) {
    throw new Error('There is no messages')
  }
  const chatGPTResponse = openAICompletion.data.choices[0].message.content;
  return JSON.parse(chatGPTResponse);
}
