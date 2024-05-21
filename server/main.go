package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/Ashmit-05/notefy/database"
	"github.com/Ashmit-05/notefy/routes"
	"github.com/joho/godotenv"
	"github.com/unidoc/unipdf/v3/common/license"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	
	err = license.SetMeteredKey(os.Getenv("LICENSE_KEY"))
	if err != nil {
		panic(err)
	}
}

func main() {
	database.ConnectToDB()
	router := http.NewServeMux()
	routes.SetUserRoutes(router)
	routes.SetNoteRoutes(router)

	fmt.Println("Notefyyyy server listening on port 8080")
	log.Fatal(http.ListenAndServe(":8080",router))
}
