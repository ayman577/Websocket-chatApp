package main

import (
	"fmt"
	"log"
	"server/apiR"
	"server/db"
	"server/internal/user"
	"server/internal/webSocket"
)

func main() {
	dsn := "root:hardwork@tcp(127.0.0.1:3306)/db"
	connection, err := db.NewDatabase(dsn)
	if err != nil {
		log.Fatal(err)
	}
	defer connection.Close()

	fmt.Println("Successfully connected to the database!")
	userArc := user.NewRepository(connection.GetDB())
	userOpr := user.NewService(userArc)
	userHS := user.NewHandler(userOpr)
	net := webSocket.Snetwork()
	netH := webSocket.Shandler(net)
	go net.Run()
	apiR.InitAR(userHS, netH)
	apiR.Start("0.0.0.0:8080")
}
