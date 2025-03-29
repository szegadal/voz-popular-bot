import { execFile } from 'child_process';
import path from 'path';

export async function transcodeAudioFile(originalFilePath: string, formatTo = 'mp3') {
  const { dir, name } = path.parse(originalFilePath);
  const tempTranscodedPath = `${dir}/${name}.${formatTo}`;

  // Command to transcode the audio using FFmpeg
  const ffmpegCommand = `/opt/ffmpeg -i ${originalFilePath} -codec:a libmp3lame -f ${formatTo} ${tempTranscodedPath}`;

  return new Promise<string>((resolve, reject) => {
    execFile('/bin/sh', ['-c', ffmpegCommand], (error) => {
      if (error) {
        console.error(`Encoding Error: ${error.message}`);
        reject(error);
      } else {
        console.log('Audio Transcoding succeeded!');
        resolve(tempTranscodedPath);
      }
    });
  });

}
