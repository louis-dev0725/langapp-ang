import { SpeechConfig, SpeechSynthesizer, ResultReason, SpeechSynthesisOutputFormat } from 'microsoft-cognitiveservices-speech-sdk';
import { promises as fs } from 'fs';
import { SpeakTextInput, SpeakTextOutput, SpeechInterface } from './SpeechInterface';

export interface AzureConfig {
  speechSubscriptionKey: string;
  serviceRegion: string;
}

export class SpeechAzure implements SpeechInterface {
  azureConfig: AzureConfig;

  constructor(config: AzureConfig) {
    this.azureConfig = config;
  }

  async speakText(input: SpeakTextInput): Promise<SpeakTextOutput> {
    let config = SpeechConfig.fromSubscription(this.azureConfig.speechSubscriptionKey, this.azureConfig.serviceRegion);
    config.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Audio48Khz192KBitRateMonoMp3;
    if (input.language) {
      config.speechSynthesisLanguage = input.language;
    }
    if (input.voiceName) {
      config.speechSynthesisVoiceName = input.voiceName;
    }
    let synth = new SpeechSynthesizer(config);

    return new Promise((resolve, reject) => {
      synth.speakTextAsync(
        input.text,
        (result) => {
          if (result.reason === ResultReason.SynthesizingAudioCompleted) {
            synth.close();
            resolve({
              audioData: result.audioData,
              originalEvent: result.audioData,
            });
          } else if (result.reason === ResultReason.Canceled) {
            synth.close();
            reject(new Error(result.errorDetails));
          }
        },
        (err) => {
          reject(new Error(JSON.stringify(err)));
        },
      );
    });
  }

  async speakTextToFile(input: SpeakTextInput, file: string): Promise<void> {
    let result = await this.speakText(input);
    await fs.writeFile(file, new Uint8Array(result.audioData));
  }

  getName() {
    return this.constructor.name;
  }
}
