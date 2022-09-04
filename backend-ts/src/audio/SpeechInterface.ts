import { Readable } from 'node:stream';

export interface SpeakTextInput {
  language?: string;
  voiceName?: string;
  text: string;
  textType?: 'text' | 'ssml';
  returnStream?: boolean;
}

export interface SpeakTextOutput {
  audioData?: ArrayBuffer;
  audioStream?: Readable;
  originalEvent: any;
}

export interface SpeechInterface {
  speakText(input: SpeakTextInput): Promise<SpeakTextOutput>;
  speakTextToFile(input: SpeakTextInput, file: string): Promise<void>;
  getName(): string;
}
