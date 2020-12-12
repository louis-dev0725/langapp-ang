// package: jumanpp.grpc
// file: jumandic-svc.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as lattice_dump_pb from "./lattice_dump_pb";
import * as juman_pb from "./juman_pb";
import * as jumanpp_pb from "./jumanpp_pb";

export class AnalysisRequest extends jspb.Message { 
    getKey(): string;
    setKey(value: string): AnalysisRequest;

    getSentence(): string;
    setSentence(value: string): AnalysisRequest;

    getType(): RequestType;
    setType(value: RequestType): AnalysisRequest;


    hasConfig(): boolean;
    clearConfig(): void;
    getConfig(): JumanppConfig | undefined;
    setConfig(value?: JumanppConfig): AnalysisRequest;

    getTopN(): number;
    setTopN(value: number): AnalysisRequest;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AnalysisRequest.AsObject;
    static toObject(includeInstance: boolean, msg: AnalysisRequest): AnalysisRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AnalysisRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AnalysisRequest;
    static deserializeBinaryFromReader(message: AnalysisRequest, reader: jspb.BinaryReader): AnalysisRequest;
}

export namespace AnalysisRequest {
    export type AsObject = {
        key: string,
        sentence: string,
        type: RequestType,
        config?: JumanppConfig.AsObject,
        topN: number,
    }
}

export class JumanppConfig extends jspb.Message { 
    getLocalBeam(): number;
    setLocalBeam(value: number): JumanppConfig;

    getGlobalBeamRight(): number;
    setGlobalBeamRight(value: number): JumanppConfig;

    getGlobalBeamLeft(): number;
    setGlobalBeamLeft(value: number): JumanppConfig;

    getGlobalBeamCheck(): number;
    setGlobalBeamCheck(value: number): JumanppConfig;

    getIgnoreRnn(): boolean;
    setIgnoreRnn(value: boolean): JumanppConfig;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): JumanppConfig.AsObject;
    static toObject(includeInstance: boolean, msg: JumanppConfig): JumanppConfig.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: JumanppConfig, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): JumanppConfig;
    static deserializeBinaryFromReader(message: JumanppConfig, reader: jspb.BinaryReader): JumanppConfig;
}

export namespace JumanppConfig {
    export type AsObject = {
        localBeam: number,
        globalBeamRight: number,
        globalBeamLeft: number,
        globalBeamCheck: number,
        ignoreRnn: boolean,
    }
}

export enum RequestType {
    NORMAL = 0,
    PARTIALANNOTATION = 1,
}
