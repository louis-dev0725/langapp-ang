import { PollyClient, PollyClientConfig, SynthesizeSpeechCommand, SynthesizeSpeechCommandOutput } from '@aws-sdk/client-polly';
import * as fs from 'fs';
import { Readable } from 'node:stream';
import { SpeakTextInput, SpeakTextOutput, SpeechInterface } from './SpeechInterface';

export class SpeechAmazon implements SpeechInterface {
  client: PollyClient;

  constructor(config: PollyClientConfig = null) {
    if (!config) {
      config = {};
    }
    if (!config.region) {
      config.region = 'eu-central-1';
    }
    this.client = new PollyClient(config);
  }

  async speakText(input: SpeakTextInput): Promise<SpeakTextOutput> {
    const command = new SynthesizeSpeechCommand({ Engine: 'neural', OutputFormat: 'mp3', Text: input.text, TextType: input.textType || 'text', VoiceId: input.voiceName, LanguageCode: input.language });
    const response = <SynthesizeSpeechCommandOutput>await this.client.send(command);
    const stream = <Readable>response.AudioStream;

    // TODO: return Buffer if need

    return { audioStream: stream, originalEvent: response };
  }

  async speakTextToFile(input: SpeakTextInput, file: string): Promise<void> {
    input.returnStream = true;
    const result = await this.speakText(input);

    await this.pipeStreamToFile(result.audioStream, file);
  }

  async pipeStreamToFile(stream: Readable, file: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(file);
      stream.pipe(writeStream);
      stream.on('end', () => resolve());
      stream.on('error', (err) => reject(err));
    });
  }

  getName() {
    return this.constructor.name;
  }
}
