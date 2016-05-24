#!/usr/bin/env bash

protoc -I/usr/local/include -I. \
 -I$GOPATH/src \
 -I$GOPATH/src/github.com/gengo/grpc-gateway/third_party/googleapis \
 --swagger_out=logtostderr=true:. \
 protos/*.proto