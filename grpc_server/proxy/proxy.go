package main
import (
	"flag"
	"net/http"

	"github.com/golang/glog"
	"golang.org/x/net/context"
	"github.com/gengo/grpc-gateway/runtime"
	"google.golang.org/grpc"

	gw "github.com/prashcr/proxy/protos"
)

var (
	localpetsEndpoint = flag.String("localpets_endpoint", "localhost:26570", "endpoint of LocalPets")
)

func run() error {
	ctx := context.Background()
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	mux := runtime.NewServeMux()
	opts := []grpc.DialOption{grpc.WithInsecure()}
	err := gw.RegisterLocalPetsHandlerFromEndpoint(ctx, mux, *localpetsEndpoint, opts)
	if err != nil {
		return err
	}

	http.ListenAndServe(":8080", mux)
	return nil
}

func main() {
	flag.Parse()
	defer glog.Flush()

	if err := run(); err != nil {
		glog.Fatal(err)
	}
}