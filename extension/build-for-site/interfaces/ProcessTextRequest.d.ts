export interface ProcessTextRequest {
    text: string;
    url: string;
    offset: number;
    languages: string[];
    exactMatch: boolean;
}
