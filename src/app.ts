import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { getTelegramFile, sendTelegramMessage } from './services/telegram.js';
import { storeFileInAws } from './services/aws.js';
import { transcodeAudioFile } from './services/ffmpeg.js';
import { chatGPTanalyzeTextSentiment, transcribeAudioOpenAI } from './services/openai.js';

export const lambdaHandler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('New POST request', event);

  try {
    const requestBody = JSON.parse(event.body!); //Handle possibly null objects: https://timmousk.com/blog/typescript-object-is-possibly-null/
    console.log(requestBody);

    if (!requestBody.message) {
      console.log("There's no message");
      return { statusCode: 200, body: '' };
    }
    const telegramMessage = requestBody.message;
    const chatId = telegramMessage.chat.id
    const downloadableFileTypes = ['animation', 'voice', 'document', 'audio', 'video']; // VideoNote and PhotoSize are missing
    const hasDownloadableObject = Object.keys(requestBody.message).some((r) => downloadableFileTypes.includes(r));

    if (telegramMessage.text) {
      console.log('message text',telegramMessage.text)
      console.log('message entities',telegramMessage.entities)
      await sendTelegramMessage(chatId, 'Estimado radioescucha, por favor envíe un mensaje de audio y diga su nombre, su edad y su comentario. Su audio debe ser de máximo 1 minuto. No use lenguaje ofensivo o discriminatorio')
    } else  if (hasDownloadableObject) {
      const tempPath = await getTelegramFile(telegramMessage);
      const transcodedFilePath = await transcodeAudioFile(tempPath);
      const audioTranscription = await transcribeAudioOpenAI(transcodedFilePath)
      const audioSentiment = await chatGPTanalyzeTextSentiment(audioTranscription)
      const messageText = `
Nombre: ${audioSentiment.name}
Sexo: ${audioSentiment.sex}
Edad: ${audioSentiment.age}
Etiquetas:
  Sentimiento: ${audioSentiment.tags.sentiment}
  Nivel de gobierno: ${audioSentiment.tags.governmentLevel}
  Es ofensivo: ${audioSentiment.tags.isOffensive}
  Es discriminatorio: ${audioSentiment.tags.isDiscriminatory}
Mensaje: ${audioTranscription}
`
      await sendTelegramMessage(chatId, messageText)
      const storingPath = 'transcoded-files/';
      await storeFileInAws(transcodedFilePath, storingPath);
    }
  } catch (err) {
    console.log('Error catched from lambdaHandler', err);
  }

  let response: APIGatewayProxyResult;
  try {
    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'hello world again',
      }),
    };
  } catch (err: unknown) {
    console.error(err);
    response = {
      statusCode: 500,
      body: JSON.stringify({
        message: err instanceof Error ? err.message : 'some error happened',
      }),
    };
  }

  return response;
};
