export interface AddToDictionaryRequest {
  wordId: number;
  wordValue: string;
  wordType: number;
  meaningValue: string;
  contextText: string;
  contextOffset: number;
  contextUrl: string;
}