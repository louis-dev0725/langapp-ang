// package: jumanpp
// file: lattice_dump.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class PathPointer extends jspb.Message { 
    getBoundary(): number;
    setBoundary(value: number): PathPointer;

    getNode(): number;
    setNode(value: number): PathPointer;

    getBeam(): number;
    setBeam(value: number): PathPointer;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PathPointer.AsObject;
    static toObject(includeInstance: boolean, msg: PathPointer): PathPointer.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PathPointer, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PathPointer;
    static deserializeBinaryFromReader(message: PathPointer, reader: jspb.BinaryReader): PathPointer;
}

export namespace PathPointer {
    export type AsObject = {
        boundary: number,
        node: number,
        beam: number,
    }
}

export class FeatureInstance extends jspb.Message { 
    getIndex(): number;
    setIndex(value: number): FeatureInstance;

    clearPatternsList(): void;
    getPatternsList(): Array<number>;
    setPatternsList(value: Array<number>): FeatureInstance;
    addPatterns(value: number, index?: number): number;

    getRepr(): string;
    setRepr(value: string): FeatureInstance;

    getRawValue(): number;
    setRawValue(value: number): FeatureInstance;

    getMaskedValue(): number;
    setMaskedValue(value: number): FeatureInstance;

    getWeight(): number;
    setWeight(value: number): FeatureInstance;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): FeatureInstance.AsObject;
    static toObject(includeInstance: boolean, msg: FeatureInstance): FeatureInstance.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: FeatureInstance, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): FeatureInstance;
    static deserializeBinaryFromReader(message: FeatureInstance, reader: jspb.BinaryReader): FeatureInstance;
}

export namespace FeatureInstance {
    export type AsObject = {
        index: number,
        patternsList: Array<number>,
        repr: string,
        rawValue: number,
        maskedValue: number,
        weight: number,
    }
}

export class LatticePathNode extends jspb.Message { 
    clearRawScoresList(): void;
    getRawScoresList(): Array<number>;
    setRawScoresList(value: Array<number>): LatticePathNode;
    addRawScores(value: number, index?: number): number;

    getCumScore(): number;
    setCumScore(value: number): LatticePathNode;

    clearRanksList(): void;
    getRanksList(): Array<number>;
    setRanksList(value: Array<number>): LatticePathNode;
    addRanks(value: number, index?: number): number;

    clearNodesList(): void;
    getNodesList(): Array<PathPointer>;
    setNodesList(value: Array<PathPointer>): LatticePathNode;
    addNodes(value?: PathPointer, index?: number): PathPointer;

    clearFeaturesList(): void;
    getFeaturesList(): Array<FeatureInstance>;
    setFeaturesList(value: Array<FeatureInstance>): LatticePathNode;
    addFeatures(value?: FeatureInstance, index?: number): FeatureInstance;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LatticePathNode.AsObject;
    static toObject(includeInstance: boolean, msg: LatticePathNode): LatticePathNode.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LatticePathNode, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LatticePathNode;
    static deserializeBinaryFromReader(message: LatticePathNode, reader: jspb.BinaryReader): LatticePathNode;
}

export namespace LatticePathNode {
    export type AsObject = {
        rawScoresList: Array<number>,
        cumScore: number,
        ranksList: Array<number>,
        nodesList: Array<PathPointer.AsObject>,
        featuresList: Array<FeatureInstance.AsObject>,
    }
}

export class KeyValue extends jspb.Message { 
    getKey(): string;
    setKey(value: string): KeyValue;

    getValue(): string;
    setValue(value: string): KeyValue;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): KeyValue.AsObject;
    static toObject(includeInstance: boolean, msg: KeyValue): KeyValue.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: KeyValue, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): KeyValue;
    static deserializeBinaryFromReader(message: KeyValue, reader: jspb.BinaryReader): KeyValue;
}

export namespace KeyValue {
    export type AsObject = {
        key: string,
        value: string,
    }
}

export class KVList extends jspb.Message { 
    clearValuesList(): void;
    getValuesList(): Array<KeyValue>;
    setValuesList(value: Array<KeyValue>): KVList;
    addValues(value?: KeyValue, index?: number): KeyValue;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): KVList.AsObject;
    static toObject(includeInstance: boolean, msg: KVList): KVList.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: KVList, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): KVList;
    static deserializeBinaryFromReader(message: KVList, reader: jspb.BinaryReader): KVList;
}

export namespace KVList {
    export type AsObject = {
        valuesList: Array<KeyValue.AsObject>,
    }
}

export class StringList extends jspb.Message { 
    clearValuesList(): void;
    getValuesList(): Array<string>;
    setValuesList(value: Array<string>): StringList;
    addValues(value: string, index?: number): string;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): StringList.AsObject;
    static toObject(includeInstance: boolean, msg: StringList): StringList.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: StringList, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): StringList;
    static deserializeBinaryFromReader(message: StringList, reader: jspb.BinaryReader): StringList;
}

export namespace StringList {
    export type AsObject = {
        valuesList: Array<string>,
    }
}

export class FieldValue extends jspb.Message { 

    hasInt(): boolean;
    clearInt(): void;
    getInt(): number;
    setInt(value: number): FieldValue;


    hasString(): boolean;
    clearString(): void;
    getString(): string;
    setString(value: string): FieldValue;


    hasKvlist(): boolean;
    clearKvlist(): void;
    getKvlist(): KVList | undefined;
    setKvlist(value?: KVList): FieldValue;


    hasStringList(): boolean;
    clearStringList(): void;
    getStringList(): StringList | undefined;
    setStringList(value?: StringList): FieldValue;


    getValueCase(): FieldValue.ValueCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): FieldValue.AsObject;
    static toObject(includeInstance: boolean, msg: FieldValue): FieldValue.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: FieldValue, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): FieldValue;
    static deserializeBinaryFromReader(message: FieldValue, reader: jspb.BinaryReader): FieldValue;
}

export namespace FieldValue {
    export type AsObject = {
        pb_int: number,
        string: string,
        kvlist?: KVList.AsObject,
        stringList?: StringList.AsObject,
    }

    export enum ValueCase {
        VALUE_NOT_SET = 0,
    
    INT = 1,

    STRING = 2,

    KVLIST = 3,

    STRING_LIST = 4,

    }

}

export class LatticeDumpNode extends jspb.Message { 
    clearValuePtrsList(): void;
    getValuePtrsList(): Array<number>;
    setValuePtrsList(value: Array<number>): LatticeDumpNode;
    addValuePtrs(value: number, index?: number): number;

    clearValuesList(): void;
    getValuesList(): Array<FieldValue>;
    setValuesList(value: Array<FieldValue>): LatticeDumpNode;
    addValues(value?: FieldValue, index?: number): FieldValue;

    getSurface(): string;
    setSurface(value: string): LatticeDumpNode;

    getLength(): number;
    setLength(value: number): LatticeDumpNode;

    clearVariantsList(): void;
    getVariantsList(): Array<LatticeDumpNode>;
    setVariantsList(value: Array<LatticeDumpNode>): LatticeDumpNode;
    addVariants(value?: LatticeDumpNode, index?: number): LatticeDumpNode;

    getEntryPtr(): number;
    setEntryPtr(value: number): LatticeDumpNode;

    clearRanksList(): void;
    getRanksList(): Array<number>;
    setRanksList(value: Array<number>): LatticeDumpNode;
    addRanks(value: number, index?: number): number;

    clearPatternsList(): void;
    getPatternsList(): Array<number>;
    setPatternsList(value: Array<number>): LatticeDumpNode;
    addPatterns(value: number, index?: number): number;

    clearBeamsList(): void;
    getBeamsList(): Array<LatticePathNode>;
    setBeamsList(value: Array<LatticePathNode>): LatticeDumpNode;
    addBeams(value?: LatticePathNode, index?: number): LatticePathNode;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LatticeDumpNode.AsObject;
    static toObject(includeInstance: boolean, msg: LatticeDumpNode): LatticeDumpNode.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LatticeDumpNode, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LatticeDumpNode;
    static deserializeBinaryFromReader(message: LatticeDumpNode, reader: jspb.BinaryReader): LatticeDumpNode;
}

export namespace LatticeDumpNode {
    export type AsObject = {
        valuePtrsList: Array<number>,
        valuesList: Array<FieldValue.AsObject>,
        surface: string,
        length: number,
        variantsList: Array<LatticeDumpNode.AsObject>,
        entryPtr: number,
        ranksList: Array<number>,
        patternsList: Array<number>,
        beamsList: Array<LatticePathNode.AsObject>,
    }
}

export class LatticeBoundary extends jspb.Message { 
    clearNodesList(): void;
    getNodesList(): Array<LatticeDumpNode>;
    setNodesList(value: Array<LatticeDumpNode>): LatticeBoundary;
    addNodes(value?: LatticeDumpNode, index?: number): LatticeDumpNode;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LatticeBoundary.AsObject;
    static toObject(includeInstance: boolean, msg: LatticeBoundary): LatticeBoundary.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LatticeBoundary, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LatticeBoundary;
    static deserializeBinaryFromReader(message: LatticeBoundary, reader: jspb.BinaryReader): LatticeBoundary;
}

export namespace LatticeBoundary {
    export type AsObject = {
        nodesList: Array<LatticeDumpNode.AsObject>,
    }
}

export class LatticeDump extends jspb.Message { 
    getSurface(): string;
    setSurface(value: string): LatticeDump;

    getComment(): string;
    setComment(value: string): LatticeDump;

    clearBoundariesList(): void;
    getBoundariesList(): Array<LatticeBoundary>;
    setBoundariesList(value: Array<LatticeBoundary>): LatticeDump;
    addBoundaries(value?: LatticeBoundary, index?: number): LatticeBoundary;

    clearFieldNamesList(): void;
    getFieldNamesList(): Array<string>;
    setFieldNamesList(value: Array<string>): LatticeDump;
    addFieldNames(value: string, index?: number): string;

    getSurfaceIdx(): number;
    setSurfaceIdx(value: number): LatticeDump;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LatticeDump.AsObject;
    static toObject(includeInstance: boolean, msg: LatticeDump): LatticeDump.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LatticeDump, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LatticeDump;
    static deserializeBinaryFromReader(message: LatticeDump, reader: jspb.BinaryReader): LatticeDump;
}

export namespace LatticeDump {
    export type AsObject = {
        surface: string,
        comment: string,
        boundariesList: Array<LatticeBoundary.AsObject>,
        fieldNamesList: Array<string>,
        surfaceIdx: number,
    }
}
