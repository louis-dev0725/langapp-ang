// package: jumanpp
// file: juman.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class JumanSentence extends jspb.Message { 
    clearMorphemesList(): void;
    getMorphemesList(): Array<JumanMorpheme>;
    setMorphemesList(value: Array<JumanMorpheme>): JumanSentence;
    addMorphemes(value?: JumanMorpheme, index?: number): JumanMorpheme;


    hasComment(): boolean;
    clearComment(): void;
    getComment(): string | undefined;
    setComment(value: string): JumanSentence;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): JumanSentence.AsObject;
    static toObject(includeInstance: boolean, msg: JumanSentence): JumanSentence.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: JumanSentence, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): JumanSentence;
    static deserializeBinaryFromReader(message: JumanSentence, reader: jspb.BinaryReader): JumanSentence;
}

export namespace JumanSentence {
    export type AsObject = {
        morphemesList: Array<JumanMorpheme.AsObject>,
        comment?: string,
    }
}

export class JumanMorpheme extends jspb.Message { 

    hasSurface(): boolean;
    clearSurface(): void;
    getSurface(): string | undefined;
    setSurface(value: string): JumanMorpheme;


    hasReading(): boolean;
    clearReading(): void;
    getReading(): string | undefined;
    setReading(value: string): JumanMorpheme;


    hasBaseform(): boolean;
    clearBaseform(): void;
    getBaseform(): string | undefined;
    setBaseform(value: string): JumanMorpheme;


    hasPosinfo(): boolean;
    clearPosinfo(): void;
    getPosinfo(): JumanPos;
    setPosinfo(value?: JumanPos): JumanMorpheme;

    clearFeaturesList(): void;
    getFeaturesList(): Array<JumanFeature>;
    setFeaturesList(value: Array<JumanFeature>): JumanMorpheme;
    addFeatures(value?: JumanFeature, index?: number): JumanFeature;


    hasStringPos(): boolean;
    clearStringPos(): void;
    getStringPos(): JumanStringPos | undefined;
    setStringPos(value?: JumanStringPos): JumanMorpheme;

    clearVariantsList(): void;
    getVariantsList(): Array<JumanMorpheme>;
    setVariantsList(value: Array<JumanMorpheme>): JumanMorpheme;
    addVariants(value?: JumanMorpheme, index?: number): JumanMorpheme;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): JumanMorpheme.AsObject;
    static toObject(includeInstance: boolean, msg: JumanMorpheme): JumanMorpheme.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: JumanMorpheme, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): JumanMorpheme;
    static deserializeBinaryFromReader(message: JumanMorpheme, reader: jspb.BinaryReader): JumanMorpheme;
}

export namespace JumanMorpheme {
    export type AsObject = {
        surface?: string,
        reading?: string,
        baseform?: string,
        posinfo: JumanPos.AsObject,
        featuresList: Array<JumanFeature.AsObject>,
        stringPos?: JumanStringPos.AsObject,
        variantsList: Array<JumanMorpheme.AsObject>,
    }
}

export class JumanPos extends jspb.Message { 

    hasPos(): boolean;
    clearPos(): void;
    getPos(): number | undefined;
    setPos(value: number): JumanPos;


    hasSubpos(): boolean;
    clearSubpos(): void;
    getSubpos(): number | undefined;
    setSubpos(value: number): JumanPos;


    hasConjType(): boolean;
    clearConjType(): void;
    getConjType(): number | undefined;
    setConjType(value: number): JumanPos;


    hasConjForm(): boolean;
    clearConjForm(): void;
    getConjForm(): number | undefined;
    setConjForm(value: number): JumanPos;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): JumanPos.AsObject;
    static toObject(includeInstance: boolean, msg: JumanPos): JumanPos.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: JumanPos, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): JumanPos;
    static deserializeBinaryFromReader(message: JumanPos, reader: jspb.BinaryReader): JumanPos;
}

export namespace JumanPos {
    export type AsObject = {
        pos?: number,
        subpos?: number,
        conjType?: number,
        conjForm?: number,
    }
}

export class JumanStringPos extends jspb.Message { 

    hasPos(): boolean;
    clearPos(): void;
    getPos(): string | undefined;
    setPos(value: string): JumanStringPos;


    hasSubpos(): boolean;
    clearSubpos(): void;
    getSubpos(): string | undefined;
    setSubpos(value: string): JumanStringPos;


    hasConjType(): boolean;
    clearConjType(): void;
    getConjType(): string | undefined;
    setConjType(value: string): JumanStringPos;


    hasConjForm(): boolean;
    clearConjForm(): void;
    getConjForm(): string | undefined;
    setConjForm(value: string): JumanStringPos;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): JumanStringPos.AsObject;
    static toObject(includeInstance: boolean, msg: JumanStringPos): JumanStringPos.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: JumanStringPos, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): JumanStringPos;
    static deserializeBinaryFromReader(message: JumanStringPos, reader: jspb.BinaryReader): JumanStringPos;
}

export namespace JumanStringPos {
    export type AsObject = {
        pos?: string,
        subpos?: string,
        conjType?: string,
        conjForm?: string,
    }
}

export class JumanFeature extends jspb.Message { 

    hasKey(): boolean;
    clearKey(): void;
    getKey(): string | undefined;
    setKey(value: string): JumanFeature;


    hasValue(): boolean;
    clearValue(): void;
    getValue(): string | undefined;
    setValue(value: string): JumanFeature;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): JumanFeature.AsObject;
    static toObject(includeInstance: boolean, msg: JumanFeature): JumanFeature.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: JumanFeature, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): JumanFeature;
    static deserializeBinaryFromReader(message: JumanFeature, reader: jspb.BinaryReader): JumanFeature;
}

export namespace JumanFeature {
    export type AsObject = {
        key?: string,
        value?: string,
    }
}
