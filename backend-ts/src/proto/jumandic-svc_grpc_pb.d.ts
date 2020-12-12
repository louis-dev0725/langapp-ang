// package: jumanpp.grpc
// file: jumandic-svc.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as jumandic_svc_pb from "./jumandic-svc_pb";
import * as lattice_dump_pb from "./lattice_dump_pb";
import * as juman_pb from "./juman_pb";
import * as jumanpp_pb from "./jumanpp_pb";

interface IJumanppJumandicService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    defaultConfig: IJumanppJumandicService_IDefaultConfig;
    juman: IJumanppJumandicService_IJuman;
    jumanStream: IJumanppJumandicService_IJumanStream;
    topN: IJumanppJumandicService_ITopN;
    topNStream: IJumanppJumandicService_ITopNStream;
    latticeDump: IJumanppJumandicService_ILatticeDump;
    latticeDumpStream: IJumanppJumandicService_ILatticeDumpStream;
    latticeDumpWithFeatures: IJumanppJumandicService_ILatticeDumpWithFeatures;
    latticeDumpWithFeaturesStream: IJumanppJumandicService_ILatticeDumpWithFeaturesStream;
}

interface IJumanppJumandicService_IDefaultConfig extends grpc.MethodDefinition<jumandic_svc_pb.JumanppConfig, jumandic_svc_pb.JumanppConfig> {
    path: "/jumanpp.grpc.JumanppJumandic/DefaultConfig";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<jumandic_svc_pb.JumanppConfig>;
    requestDeserialize: grpc.deserialize<jumandic_svc_pb.JumanppConfig>;
    responseSerialize: grpc.serialize<jumandic_svc_pb.JumanppConfig>;
    responseDeserialize: grpc.deserialize<jumandic_svc_pb.JumanppConfig>;
}
interface IJumanppJumandicService_IJuman extends grpc.MethodDefinition<jumandic_svc_pb.AnalysisRequest, juman_pb.JumanSentence> {
    path: "/jumanpp.grpc.JumanppJumandic/Juman";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<jumandic_svc_pb.AnalysisRequest>;
    requestDeserialize: grpc.deserialize<jumandic_svc_pb.AnalysisRequest>;
    responseSerialize: grpc.serialize<juman_pb.JumanSentence>;
    responseDeserialize: grpc.deserialize<juman_pb.JumanSentence>;
}
interface IJumanppJumandicService_IJumanStream extends grpc.MethodDefinition<jumandic_svc_pb.AnalysisRequest, juman_pb.JumanSentence> {
    path: "/jumanpp.grpc.JumanppJumandic/JumanStream";
    requestStream: true;
    responseStream: true;
    requestSerialize: grpc.serialize<jumandic_svc_pb.AnalysisRequest>;
    requestDeserialize: grpc.deserialize<jumandic_svc_pb.AnalysisRequest>;
    responseSerialize: grpc.serialize<juman_pb.JumanSentence>;
    responseDeserialize: grpc.deserialize<juman_pb.JumanSentence>;
}
interface IJumanppJumandicService_ITopN extends grpc.MethodDefinition<jumandic_svc_pb.AnalysisRequest, jumanpp_pb.Lattice> {
    path: "/jumanpp.grpc.JumanppJumandic/TopN";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<jumandic_svc_pb.AnalysisRequest>;
    requestDeserialize: grpc.deserialize<jumandic_svc_pb.AnalysisRequest>;
    responseSerialize: grpc.serialize<jumanpp_pb.Lattice>;
    responseDeserialize: grpc.deserialize<jumanpp_pb.Lattice>;
}
interface IJumanppJumandicService_ITopNStream extends grpc.MethodDefinition<jumandic_svc_pb.AnalysisRequest, jumanpp_pb.Lattice> {
    path: "/jumanpp.grpc.JumanppJumandic/TopNStream";
    requestStream: true;
    responseStream: true;
    requestSerialize: grpc.serialize<jumandic_svc_pb.AnalysisRequest>;
    requestDeserialize: grpc.deserialize<jumandic_svc_pb.AnalysisRequest>;
    responseSerialize: grpc.serialize<jumanpp_pb.Lattice>;
    responseDeserialize: grpc.deserialize<jumanpp_pb.Lattice>;
}
interface IJumanppJumandicService_ILatticeDump extends grpc.MethodDefinition<jumandic_svc_pb.AnalysisRequest, lattice_dump_pb.LatticeDump> {
    path: "/jumanpp.grpc.JumanppJumandic/LatticeDump";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<jumandic_svc_pb.AnalysisRequest>;
    requestDeserialize: grpc.deserialize<jumandic_svc_pb.AnalysisRequest>;
    responseSerialize: grpc.serialize<lattice_dump_pb.LatticeDump>;
    responseDeserialize: grpc.deserialize<lattice_dump_pb.LatticeDump>;
}
interface IJumanppJumandicService_ILatticeDumpStream extends grpc.MethodDefinition<jumandic_svc_pb.AnalysisRequest, lattice_dump_pb.LatticeDump> {
    path: "/jumanpp.grpc.JumanppJumandic/LatticeDumpStream";
    requestStream: true;
    responseStream: true;
    requestSerialize: grpc.serialize<jumandic_svc_pb.AnalysisRequest>;
    requestDeserialize: grpc.deserialize<jumandic_svc_pb.AnalysisRequest>;
    responseSerialize: grpc.serialize<lattice_dump_pb.LatticeDump>;
    responseDeserialize: grpc.deserialize<lattice_dump_pb.LatticeDump>;
}
interface IJumanppJumandicService_ILatticeDumpWithFeatures extends grpc.MethodDefinition<jumandic_svc_pb.AnalysisRequest, lattice_dump_pb.LatticeDump> {
    path: "/jumanpp.grpc.JumanppJumandic/LatticeDumpWithFeatures";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<jumandic_svc_pb.AnalysisRequest>;
    requestDeserialize: grpc.deserialize<jumandic_svc_pb.AnalysisRequest>;
    responseSerialize: grpc.serialize<lattice_dump_pb.LatticeDump>;
    responseDeserialize: grpc.deserialize<lattice_dump_pb.LatticeDump>;
}
interface IJumanppJumandicService_ILatticeDumpWithFeaturesStream extends grpc.MethodDefinition<jumandic_svc_pb.AnalysisRequest, lattice_dump_pb.LatticeDump> {
    path: "/jumanpp.grpc.JumanppJumandic/LatticeDumpWithFeaturesStream";
    requestStream: true;
    responseStream: true;
    requestSerialize: grpc.serialize<jumandic_svc_pb.AnalysisRequest>;
    requestDeserialize: grpc.deserialize<jumandic_svc_pb.AnalysisRequest>;
    responseSerialize: grpc.serialize<lattice_dump_pb.LatticeDump>;
    responseDeserialize: grpc.deserialize<lattice_dump_pb.LatticeDump>;
}

export const JumanppJumandicService: IJumanppJumandicService;

export interface IJumanppJumandicServer {
    defaultConfig: grpc.handleUnaryCall<jumandic_svc_pb.JumanppConfig, jumandic_svc_pb.JumanppConfig>;
    juman: grpc.handleUnaryCall<jumandic_svc_pb.AnalysisRequest, juman_pb.JumanSentence>;
    jumanStream: grpc.handleBidiStreamingCall<jumandic_svc_pb.AnalysisRequest, juman_pb.JumanSentence>;
    topN: grpc.handleUnaryCall<jumandic_svc_pb.AnalysisRequest, jumanpp_pb.Lattice>;
    topNStream: grpc.handleBidiStreamingCall<jumandic_svc_pb.AnalysisRequest, jumanpp_pb.Lattice>;
    latticeDump: grpc.handleUnaryCall<jumandic_svc_pb.AnalysisRequest, lattice_dump_pb.LatticeDump>;
    latticeDumpStream: grpc.handleBidiStreamingCall<jumandic_svc_pb.AnalysisRequest, lattice_dump_pb.LatticeDump>;
    latticeDumpWithFeatures: grpc.handleUnaryCall<jumandic_svc_pb.AnalysisRequest, lattice_dump_pb.LatticeDump>;
    latticeDumpWithFeaturesStream: grpc.handleBidiStreamingCall<jumandic_svc_pb.AnalysisRequest, lattice_dump_pb.LatticeDump>;
}

export interface IJumanppJumandicClient {
    defaultConfig(request: jumandic_svc_pb.JumanppConfig, callback: (error: grpc.ServiceError | null, response: jumandic_svc_pb.JumanppConfig) => void): grpc.ClientUnaryCall;
    defaultConfig(request: jumandic_svc_pb.JumanppConfig, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: jumandic_svc_pb.JumanppConfig) => void): grpc.ClientUnaryCall;
    defaultConfig(request: jumandic_svc_pb.JumanppConfig, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: jumandic_svc_pb.JumanppConfig) => void): grpc.ClientUnaryCall;
    juman(request: jumandic_svc_pb.AnalysisRequest, callback: (error: grpc.ServiceError | null, response: juman_pb.JumanSentence) => void): grpc.ClientUnaryCall;
    juman(request: jumandic_svc_pb.AnalysisRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: juman_pb.JumanSentence) => void): grpc.ClientUnaryCall;
    juman(request: jumandic_svc_pb.AnalysisRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: juman_pb.JumanSentence) => void): grpc.ClientUnaryCall;
    jumanStream(): grpc.ClientDuplexStream<jumandic_svc_pb.AnalysisRequest, juman_pb.JumanSentence>;
    jumanStream(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<jumandic_svc_pb.AnalysisRequest, juman_pb.JumanSentence>;
    jumanStream(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<jumandic_svc_pb.AnalysisRequest, juman_pb.JumanSentence>;
    topN(request: jumandic_svc_pb.AnalysisRequest, callback: (error: grpc.ServiceError | null, response: jumanpp_pb.Lattice) => void): grpc.ClientUnaryCall;
    topN(request: jumandic_svc_pb.AnalysisRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: jumanpp_pb.Lattice) => void): grpc.ClientUnaryCall;
    topN(request: jumandic_svc_pb.AnalysisRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: jumanpp_pb.Lattice) => void): grpc.ClientUnaryCall;
    topNStream(): grpc.ClientDuplexStream<jumandic_svc_pb.AnalysisRequest, jumanpp_pb.Lattice>;
    topNStream(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<jumandic_svc_pb.AnalysisRequest, jumanpp_pb.Lattice>;
    topNStream(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<jumandic_svc_pb.AnalysisRequest, jumanpp_pb.Lattice>;
    latticeDump(request: jumandic_svc_pb.AnalysisRequest, callback: (error: grpc.ServiceError | null, response: lattice_dump_pb.LatticeDump) => void): grpc.ClientUnaryCall;
    latticeDump(request: jumandic_svc_pb.AnalysisRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lattice_dump_pb.LatticeDump) => void): grpc.ClientUnaryCall;
    latticeDump(request: jumandic_svc_pb.AnalysisRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lattice_dump_pb.LatticeDump) => void): grpc.ClientUnaryCall;
    latticeDumpStream(): grpc.ClientDuplexStream<jumandic_svc_pb.AnalysisRequest, lattice_dump_pb.LatticeDump>;
    latticeDumpStream(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<jumandic_svc_pb.AnalysisRequest, lattice_dump_pb.LatticeDump>;
    latticeDumpStream(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<jumandic_svc_pb.AnalysisRequest, lattice_dump_pb.LatticeDump>;
    latticeDumpWithFeatures(request: jumandic_svc_pb.AnalysisRequest, callback: (error: grpc.ServiceError | null, response: lattice_dump_pb.LatticeDump) => void): grpc.ClientUnaryCall;
    latticeDumpWithFeatures(request: jumandic_svc_pb.AnalysisRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lattice_dump_pb.LatticeDump) => void): grpc.ClientUnaryCall;
    latticeDumpWithFeatures(request: jumandic_svc_pb.AnalysisRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lattice_dump_pb.LatticeDump) => void): grpc.ClientUnaryCall;
    latticeDumpWithFeaturesStream(): grpc.ClientDuplexStream<jumandic_svc_pb.AnalysisRequest, lattice_dump_pb.LatticeDump>;
    latticeDumpWithFeaturesStream(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<jumandic_svc_pb.AnalysisRequest, lattice_dump_pb.LatticeDump>;
    latticeDumpWithFeaturesStream(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<jumandic_svc_pb.AnalysisRequest, lattice_dump_pb.LatticeDump>;
}

export class JumanppJumandicClient extends grpc.Client implements IJumanppJumandicClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public defaultConfig(request: jumandic_svc_pb.JumanppConfig, callback: (error: grpc.ServiceError | null, response: jumandic_svc_pb.JumanppConfig) => void): grpc.ClientUnaryCall;
    public defaultConfig(request: jumandic_svc_pb.JumanppConfig, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: jumandic_svc_pb.JumanppConfig) => void): grpc.ClientUnaryCall;
    public defaultConfig(request: jumandic_svc_pb.JumanppConfig, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: jumandic_svc_pb.JumanppConfig) => void): grpc.ClientUnaryCall;
    public juman(request: jumandic_svc_pb.AnalysisRequest, callback: (error: grpc.ServiceError | null, response: juman_pb.JumanSentence) => void): grpc.ClientUnaryCall;
    public juman(request: jumandic_svc_pb.AnalysisRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: juman_pb.JumanSentence) => void): grpc.ClientUnaryCall;
    public juman(request: jumandic_svc_pb.AnalysisRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: juman_pb.JumanSentence) => void): grpc.ClientUnaryCall;
    public jumanStream(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<jumandic_svc_pb.AnalysisRequest, juman_pb.JumanSentence>;
    public jumanStream(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<jumandic_svc_pb.AnalysisRequest, juman_pb.JumanSentence>;
    public topN(request: jumandic_svc_pb.AnalysisRequest, callback: (error: grpc.ServiceError | null, response: jumanpp_pb.Lattice) => void): grpc.ClientUnaryCall;
    public topN(request: jumandic_svc_pb.AnalysisRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: jumanpp_pb.Lattice) => void): grpc.ClientUnaryCall;
    public topN(request: jumandic_svc_pb.AnalysisRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: jumanpp_pb.Lattice) => void): grpc.ClientUnaryCall;
    public topNStream(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<jumandic_svc_pb.AnalysisRequest, jumanpp_pb.Lattice>;
    public topNStream(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<jumandic_svc_pb.AnalysisRequest, jumanpp_pb.Lattice>;
    public latticeDump(request: jumandic_svc_pb.AnalysisRequest, callback: (error: grpc.ServiceError | null, response: lattice_dump_pb.LatticeDump) => void): grpc.ClientUnaryCall;
    public latticeDump(request: jumandic_svc_pb.AnalysisRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lattice_dump_pb.LatticeDump) => void): grpc.ClientUnaryCall;
    public latticeDump(request: jumandic_svc_pb.AnalysisRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lattice_dump_pb.LatticeDump) => void): grpc.ClientUnaryCall;
    public latticeDumpStream(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<jumandic_svc_pb.AnalysisRequest, lattice_dump_pb.LatticeDump>;
    public latticeDumpStream(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<jumandic_svc_pb.AnalysisRequest, lattice_dump_pb.LatticeDump>;
    public latticeDumpWithFeatures(request: jumandic_svc_pb.AnalysisRequest, callback: (error: grpc.ServiceError | null, response: lattice_dump_pb.LatticeDump) => void): grpc.ClientUnaryCall;
    public latticeDumpWithFeatures(request: jumandic_svc_pb.AnalysisRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lattice_dump_pb.LatticeDump) => void): grpc.ClientUnaryCall;
    public latticeDumpWithFeatures(request: jumandic_svc_pb.AnalysisRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lattice_dump_pb.LatticeDump) => void): grpc.ClientUnaryCall;
    public latticeDumpWithFeaturesStream(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<jumandic_svc_pb.AnalysisRequest, lattice_dump_pb.LatticeDump>;
    public latticeDumpWithFeaturesStream(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<jumandic_svc_pb.AnalysisRequest, lattice_dump_pb.LatticeDump>;
}
