localpets
=========

> A microservice for a pet adoption service, that connects customers and pets based on preferences and characteristics

Features
--------

- Written in [grpc-node](https://www.npmjs.com/package/grpc) and uses MongoDB for persistence
- Automatically generates a [Swagger](http://swagger.io/)-compatible JSON reverse proxy REST API in Go, for clients that don't support HTTP2 or have a gRPC implementation. View [grpc-gateway](https://github.com/gengo/grpc-gateway) and `protos/localpets.proto` for more details.

Usage
------------

#### Instructions for running gRPC server

```
npm install
npm serve
```

#### Instructions for automatic generation of REST proxy.
Adapted from [grpc-gateway](https://github.com/gengo/grpc-gateway).

Make sure you have `Go` installed and `GOPATH` set, before proceeding

Install latest ProtocolBuffers
```
mkdir tmp
cd tmp
git clone https://github.com/google/protobuf
cd protobuf
./autogen.sh
./configure
make
make check
sudo make install
```

Install required Go packages
```
go get -u github.com/gengo/grpc-gateway/protoc-gen-grpc-gateway
go get -u github.com/gengo/grpc-gateway/protoc-gen-swagger
go get -u github.com/golang/protobuf/protoc-gen-go
```

Generate proxy server and run it
> `genproxy` is a bash script that compiles `.proto` into a stub, t
```
$ npm run genproxy
$ npm run proxy
```

(optional) Generate [Swagger](http://swagger.io) spec in current dir
```
$ npm run genswagger
```