import { promises as fs } from 'fs';
import { TextToSpeechClient, protos } from '@google-cloud/text-to-speech';
import { SpeakTextInput, SpeakTextOutput, SpeechInterface } from './SpeechInterface';

export class SpeechGoogle implements SpeechInterface {
  client = new TextToSpeechClient();

  constructor(config: any = {}) {}

  async speakText(input: SpeakTextInput): Promise<SpeakTextOutput> {
    const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
      input: { text: input.text },
      voice: { languageCode: input.language, name: input.voiceName },
      audioConfig: { audioEncoding: 'MP3' },
    };

    // Performs the text-to-speech request
    const [response] = await this.client.synthesizeSpeech(request);

    return {
      audioData: <Uint8Array>response.audioContent,
      originalEvent: response,
    };
  }

  async speakTextToFile(input: SpeakTextInput, file: string) {
    let result = await this.speakText(input);
    await fs.writeFile(file, new Uint8Array(result.audioData), 'binary');
  }

  getName() {
    return this.constructor.name;
  }
}
