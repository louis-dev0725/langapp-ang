// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var jumandic$svc_pb = require('./jumandic-svc_pb.js');
var lattice_dump_pb = require('./lattice_dump_pb.js');
var juman_pb = require('./juman_pb.js');
var jumanpp_pb = require('./jumanpp_pb.js');

function serialize_jumanpp_JumanSentence(arg) {
  if (!(arg instanceof juman_pb.JumanSentence)) {
    throw new Error('Expected argument of type jumanpp.JumanSentence');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_jumanpp_JumanSentence(buffer_arg) {
  return juman_pb.JumanSentence.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_jumanpp_Lattice(arg) {
  if (!(arg instanceof jumanpp_pb.Lattice)) {
    throw new Error('Expected argument of type jumanpp.Lattice');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_jumanpp_Lattice(buffer_arg) {
  return jumanpp_pb.Lattice.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_jumanpp_LatticeDump(arg) {
  if (!(arg instanceof lattice_dump_pb.LatticeDump)) {
    throw new Error('Expected argument of type jumanpp.LatticeDump');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_jumanpp_LatticeDump(buffer_arg) {
  return lattice_dump_pb.LatticeDump.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_jumanpp_grpc_AnalysisRequest(arg) {
  if (!(arg instanceof jumandic$svc_pb.AnalysisRequest)) {
    throw new Error('Expected argument of type jumanpp.grpc.AnalysisRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_jumanpp_grpc_AnalysisRequest(buffer_arg) {
  return jumandic$svc_pb.AnalysisRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_jumanpp_grpc_JumanppConfig(arg) {
  if (!(arg instanceof jumandic$svc_pb.JumanppConfig)) {
    throw new Error('Expected argument of type jumanpp.grpc.JumanppConfig');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_jumanpp_grpc_JumanppConfig(buffer_arg) {
  return jumandic$svc_pb.JumanppConfig.deserializeBinary(new Uint8Array(buffer_arg));
}


var JumanppJumandicService = exports.JumanppJumandicService = {
  defaultConfig: {
    path: '/jumanpp.grpc.JumanppJumandic/DefaultConfig',
    requestStream: false,
    responseStream: false,
    requestType: jumandic$svc_pb.JumanppConfig,
    responseType: jumandic$svc_pb.JumanppConfig,
    requestSerialize: serialize_jumanpp_grpc_JumanppConfig,
    requestDeserialize: deserialize_jumanpp_grpc_JumanppConfig,
    responseSerialize: serialize_jumanpp_grpc_JumanppConfig,
    responseDeserialize: deserialize_jumanpp_grpc_JumanppConfig,
  },
  juman: {
    path: '/jumanpp.grpc.JumanppJumandic/Juman',
    requestStream: false,
    responseStream: false,
    requestType: jumandic$svc_pb.AnalysisRequest,
    responseType: juman_pb.JumanSentence,
    requestSerialize: serialize_jumanpp_grpc_AnalysisRequest,
    requestDeserialize: deserialize_jumanpp_grpc_AnalysisRequest,
    responseSerialize: serialize_jumanpp_JumanSentence,
    responseDeserialize: deserialize_jumanpp_JumanSentence,
  },
  jumanStream: {
    path: '/jumanpp.grpc.JumanppJumandic/JumanStream',
    requestStream: true,
    responseStream: true,
    requestType: jumandic$svc_pb.AnalysisRequest,
    responseType: juman_pb.JumanSentence,
    requestSerialize: serialize_jumanpp_grpc_AnalysisRequest,
    requestDeserialize: deserialize_jumanpp_grpc_AnalysisRequest,
    responseSerialize: serialize_jumanpp_JumanSentence,
    responseDeserialize: deserialize_jumanpp_JumanSentence,
  },
  topN: {
    path: '/jumanpp.grpc.JumanppJumandic/TopN',
    requestStream: false,
    responseStream: false,
    requestType: jumandic$svc_pb.AnalysisRequest,
    responseType: jumanpp_pb.Lattice,
    requestSerialize: serialize_jumanpp_grpc_AnalysisRequest,
    requestDeserialize: deserialize_jumanpp_grpc_AnalysisRequest,
    responseSerialize: serialize_jumanpp_Lattice,
    responseDeserialize: deserialize_jumanpp_Lattice,
  },
  topNStream: {
    path: '/jumanpp.grpc.JumanppJumandic/TopNStream',
    requestStream: true,
    responseStream: true,
    requestType: jumandic$svc_pb.AnalysisRequest,
    responseType: jumanpp_pb.Lattice,
    requestSerialize: serialize_jumanpp_grpc_AnalysisRequest,
    requestDeserialize: deserialize_jumanpp_grpc_AnalysisRequest,
    responseSerialize: serialize_jumanpp_Lattice,
    responseDeserialize: deserialize_jumanpp_Lattice,
  },
  latticeDump: {
    path: '/jumanpp.grpc.JumanppJumandic/LatticeDump',
    requestStream: false,
    responseStream: false,
    requestType: jumandic$svc_pb.AnalysisRequest,
    responseType: lattice_dump_pb.LatticeDump,
    requestSerialize: serialize_jumanpp_grpc_AnalysisRequest,
    requestDeserialize: deserialize_jumanpp_grpc_AnalysisRequest,
    responseSerialize: serialize_jumanpp_LatticeDump,
    responseDeserialize: deserialize_jumanpp_LatticeDump,
  },
  latticeDumpStream: {
    path: '/jumanpp.grpc.JumanppJumandic/LatticeDumpStream',
    requestStream: true,
    responseStream: true,
    requestType: jumandic$svc_pb.AnalysisRequest,
    responseType: lattice_dump_pb.LatticeDump,
    requestSerialize: serialize_jumanpp_grpc_AnalysisRequest,
    requestDeserialize: deserialize_jumanpp_grpc_AnalysisRequest,
    responseSerialize: serialize_jumanpp_LatticeDump,
    responseDeserialize: deserialize_jumanpp_LatticeDump,
  },
  latticeDumpWithFeatures: {
    path: '/jumanpp.grpc.JumanppJumandic/LatticeDumpWithFeatures',
    requestStream: false,
    responseStream: false,
    requestType: jumandic$svc_pb.AnalysisRequest,
    responseType: lattice_dump_pb.LatticeDump,
    requestSerialize: serialize_jumanpp_grpc_AnalysisRequest,
    requestDeserialize: deserialize_jumanpp_grpc_AnalysisRequest,
    responseSerialize: serialize_jumanpp_LatticeDump,
    responseDeserialize: deserialize_jumanpp_LatticeDump,
  },
  latticeDumpWithFeaturesStream: {
    path: '/jumanpp.grpc.JumanppJumandic/LatticeDumpWithFeaturesStream',
    requestStream: true,
    responseStream: true,
    requestType: jumandic$svc_pb.AnalysisRequest,
    responseType: lattice_dump_pb.LatticeDump,
    requestSerialize: serialize_jumanpp_grpc_AnalysisRequest,
    requestDeserialize: deserialize_jumanpp_grpc_AnalysisRequest,
    responseSerialize: serialize_jumanpp_LatticeDump,
    responseDeserialize: deserialize_jumanpp_LatticeDump,
  },
};

exports.JumanppJumandicClient = grpc.makeGenericClientConstructor(JumanppJumandicService);
