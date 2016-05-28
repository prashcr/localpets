localpets
=========

> A microservice for a pet adoption service, that connects customers and pets based on preferences and characteristics

Features
--------

- Written in [grpc-node](https://www.npmjs.com/package/grpc) and uses MongoDB for persistence
- Automatically generates a [Swagger](http://swagger.io/)-compatible REST reverse proxy in Go, for clients that don't support HTTP2 or have a gRPC implementation. View [grpc-gateway](https://github.com/gengo/grpc-gateway) and `protos/localpets.proto` for more details about the REST endpoints.

### Entities

#### Pet
- _id
- name
- age
- availableFrom
- species
- breed
- adoptedBy

#### Customer
- _id
- name
- prefMinAge
- prefMaxAge
- prefSpecies
- prefBreeds

Usage
------------

#### Instructions for running gRPC server

```
npm install
npm start
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
> `genproxy` runs a bash script that compiles `.proto` into a gRPC stub, then generates a reverse proxy and an entrypoint for the reverse proxy (located in `proxy/proxy.go`) These generated files will live under $GOPATH/src/github.com/prashcr/proxy.
```
$ npm run genproxy
$ npm run proxy
```

(optional) Generate [Swagger](http://swagger.io) spec in `protos` dir
```
$ npm run genswagger
```

#### REST API
View `protos/localpets.proto` for the list of endpoints and their query/path params. The proxy server listens on port `8080` by default, which can be changed in `proxy/proxy.go`.