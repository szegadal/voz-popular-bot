import fetch from 'node-fetch';
import fs from 'fs';
import { Message, Animation, Voice, Document, Audio, Video, File } from '@grammyjs/types';

interface ResponseData {
  ok: boolean;
  result: File;
}

const apiKey = process.env.TELEGRAM_API_KEY;
const urlBase = new URL('https://api.telegram.org/');

export async function sendTelegramMessage(chatId:string, messageText:string) {
  try {
    const requestDetails = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText
      }),
    };

    urlBase.pathname = `bot${apiKey}/sendMessage`;
    const url = urlBase.toString();
    const response = await fetch(url, requestDetails).then((res) => res.json());
    console.log(response)
  } catch (err:any) {
    err.name = "sendTelegramMessageException";
    throw err;
  }
}

async function getTelegramFileLink(fileId: string) {
  try {
    const telegramUrl = new URL('https://api.telegram.org/');
    const requestDetails = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file_id: fileId,
      }),
    };

    telegramUrl.pathname = `bot${apiKey}/getFile`;
    const url = telegramUrl.toString();
    const response = (await fetch(url, requestDetails).then((res) => res.json())) as ResponseData;
    telegramUrl.pathname = `file/bot${apiKey}/${response.result.file_path}`;
    return telegramUrl.toString();
  } catch (err: any) {
    err.name = 'getFileLinkError';
    throw err;
  }
}

async function getTelegramFile(fileMessage: Message) {
  try {
    console.log('Calling getTelegramFile');

    type FileMessageType = Animation | Voice | Document | Audio | Video; // TODO: Move to custom types
    const validFileTypes = ['animation', 'voice', 'document', 'audio', 'video']; // VideoNote and PhotoSize are missing
    let fileType: FileMessageType | undefined;
    for (const file of validFileTypes) {
      if (fileMessage[file as keyof Message]) {
        fileType = fileMessage[file as keyof Message] as FileMessageType;
        break;
      }
    }

    if (fileType === undefined) {
      throw new Error("There's no file to download");
    }

    const fileId = fileType.file_id;
    const fileExt = fileType.mime_type!.split('/').pop();

    const myFileUrl = await getTelegramFileLink(fileId);
    console.log(myFileUrl);
    const fileName = `${fileId}.${fileExt}`;
    // const tempPath = path.join('tmp/', fileName);
    const tempPath = `/tmp/${fileName}`;
    await fetch(myFileUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to download file');
        }
        const fileStream = fs.createWriteStream(tempPath);
        res.body!.pipe(fileStream);
        return new Promise((resolve, reject) => {
          fileStream.on('finish', resolve);
          fileStream.on('error', reject);
        });
      })
      .then(() => {
        console.log('File stored in ', tempPath);
      });
    return tempPath;
  } catch (err: any) {
    err.name = 'getFileError';
    throw err;
  }
}

export { getTelegramFile };
