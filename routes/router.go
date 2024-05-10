package routes

import (
	"net/http"

	"github.com/Ashmit-05/notefy/controllers"
)

func SetUserRoutes(router *http.ServeMux) {
	router.HandleFunc("POST /signup",controllers.SignUp)
	router.HandleFunc("POST /signin",controllers.SignIn)
}

func SetNoteRoutes(router *http.ServeMux) {
	router.HandleFunc("POST /note",controllers.CreateNote)
}
