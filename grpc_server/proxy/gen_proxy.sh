#!/usr/bin/env bash

PROXY_SRC="$GOPATH/src/github.com/prashcr/proxy";
mkdir -p $GO_SRC &&
protoc -I/usr/local/include -I. \
 -I$GOPATH/src \
 -I$GOPATH/src/github.com/gengo/grpc-gateway/third_party/googleapis \
 --go_out=Mgoogle/api/annotations.proto=github.com/gengo/grpc-gateway/third_party/googleapis/google/api,plugins=grpc:$PROXY_SRC \
 protos/*.proto &&
protoc -I/usr/local/include -I. \
 -I$GOPATH/src \
 -I$GOPATH/src/github.com/gengo/grpc-gateway/third_party/googleapis \
 --grpc-gateway_out=logtostderr=true:$PROXY_SRC_SRC \
 protos/*.proto
cp proxy/proxy.go $PROXY_SRC_SRC