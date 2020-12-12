// package: jumanpp
// file: jumanpp.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as juman_pb from "./juman_pb";

export class LatticeNode extends jspb.Message { 

    hasNodeId(): boolean;
    clearNodeId(): void;
    getNodeId(): number | undefined;
    setNodeId(value: number): LatticeNode;

    clearPrevNodesList(): void;
    getPrevNodesList(): Array<number>;
    setPrevNodesList(value: Array<number>): LatticeNode;
    addPrevNodes(value: number, index?: number): number;


    hasStartIndex(): boolean;
    clearStartIndex(): void;
    getStartIndex(): number | undefined;
    setStartIndex(value: number): LatticeNode;


    hasEndIndex(): boolean;
    clearEndIndex(): void;
    getEndIndex(): number | undefined;
    setEndIndex(value: number): LatticeNode;


    hasSurface(): boolean;
    clearSurface(): void;
    getSurface(): string | undefined;
    setSurface(value: string): LatticeNode;


    hasCanonical(): boolean;
    clearCanonical(): void;
    getCanonical(): string | undefined;
    setCanonical(value: string): LatticeNode;


    hasReading(): boolean;
    clearReading(): void;
    getReading(): string | undefined;
    setReading(value: string): LatticeNode;


    hasDicform(): boolean;
    clearDicform(): void;
    getDicform(): string | undefined;
    setDicform(value: string): LatticeNode;


    hasPos(): boolean;
    clearPos(): void;
    getPos(): juman_pb.JumanPos;
    setPos(value?: juman_pb.JumanPos): LatticeNode;

    clearCumulativeScoresList(): void;
    getCumulativeScoresList(): Array<number>;
    setCumulativeScoresList(value: Array<number>): LatticeNode;
    addCumulativeScores(value: number, index?: number): number;

    clearScoreDetailsList(): void;
    getScoreDetailsList(): Array<ScoreDetail>;
    setScoreDetailsList(value: Array<ScoreDetail>): LatticeNode;
    addScoreDetails(value?: ScoreDetail, index?: number): ScoreDetail;

    clearRanksList(): void;
    getRanksList(): Array<number>;
    setRanksList(value: Array<number>): LatticeNode;
    addRanks(value: number, index?: number): number;

    clearFeaturesList(): void;
    getFeaturesList(): Array<juman_pb.JumanFeature>;
    setFeaturesList(value: Array<juman_pb.JumanFeature>): LatticeNode;
    addFeatures(value?: juman_pb.JumanFeature, index?: number): juman_pb.JumanFeature;


    hasStringPos(): boolean;
    clearStringPos(): void;
    getStringPos(): juman_pb.JumanStringPos | undefined;
    setStringPos(value?: juman_pb.JumanStringPos): LatticeNode;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LatticeNode.AsObject;
    static toObject(includeInstance: boolean, msg: LatticeNode): LatticeNode.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LatticeNode, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LatticeNode;
    static deserializeBinaryFromReader(message: LatticeNode, reader: jspb.BinaryReader): LatticeNode;
}

export namespace LatticeNode {
    export type AsObject = {
        nodeId?: number,
        prevNodesList: Array<number>,
        startIndex?: number,
        endIndex?: number,
        surface?: string,
        canonical?: string,
        reading?: string,
        dicform?: string,
        pos: juman_pb.JumanPos.AsObject,
        cumulativeScoresList: Array<number>,
        scoreDetailsList: Array<ScoreDetail.AsObject>,
        ranksList: Array<number>,
        featuresList: Array<juman_pb.JumanFeature.AsObject>,
        stringPos?: juman_pb.JumanStringPos.AsObject,
    }
}

export class ScoreDetail extends jspb.Message { 

    hasLinear(): boolean;
    clearLinear(): void;
    getLinear(): number | undefined;
    setLinear(value: number): ScoreDetail;

    clearAdditionalList(): void;
    getAdditionalList(): Array<number>;
    setAdditionalList(value: Array<number>): ScoreDetail;
    addAdditional(value: number, index?: number): number;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ScoreDetail.AsObject;
    static toObject(includeInstance: boolean, msg: ScoreDetail): ScoreDetail.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ScoreDetail, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ScoreDetail;
    static deserializeBinaryFromReader(message: ScoreDetail, reader: jspb.BinaryReader): ScoreDetail;
}

export namespace ScoreDetail {
    export type AsObject = {
        linear?: number,
        additionalList: Array<number>,
    }
}

export class Lattice extends jspb.Message { 

    hasComment(): boolean;
    clearComment(): void;
    getComment(): string | undefined;
    setComment(value: string): Lattice;

    clearNodesList(): void;
    getNodesList(): Array<LatticeNode>;
    setNodesList(value: Array<LatticeNode>): Lattice;
    addNodes(value?: LatticeNode, index?: number): LatticeNode;

    clearScoresList(): void;
    getScoresList(): Array<number>;
    setScoresList(value: Array<number>): Lattice;
    addScores(value: number, index?: number): number;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Lattice.AsObject;
    static toObject(includeInstance: boolean, msg: Lattice): Lattice.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Lattice, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Lattice;
    static deserializeBinaryFromReader(message: Lattice, reader: jspb.BinaryReader): Lattice;
}

export namespace Lattice {
    export type AsObject = {
        comment?: string,
        nodesList: Array<LatticeNode.AsObject>,
        scoresList: Array<number>,
    }
}
