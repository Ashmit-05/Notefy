package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/Ashmit-05/notefy/database"
	"github.com/Ashmit-05/notefy/routes"
)


func main() {
	database.ConnectToDB()
	router := http.NewServeMux()
	routes.SetUserRoutes(router)

	fmt.Println("Notefyyyy server listening on port 8080")
	log.Fatal(http.ListenAndServe(":8080",router))
}

