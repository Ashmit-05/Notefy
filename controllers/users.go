package controllers

import (
	"context"
	"encoding/json"
	"io"
	"net/http"

	"github.com/Ashmit-05/notefy/database"
	"github.com/Ashmit-05/notefy/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

func SignUp(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type","application/json")
	w.Header().Set("Allow-Control-Allow-Methods","POST")

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w,"Failed to read request body", http.StatusBadRequest)
	}

	var user models.User
	err = json.Unmarshal(body,&user)
	if err != nil {
		http.Error(w,"Unable to parse JSON",http.StatusBadRequest)
	}

	// add middlewares to check data and check if user exists

	hashedpassword, err := bcrypt.GenerateFromPassword([]byte(user.Password),10)
	if err != nil {
		http.Error(w,"An error occured", http.StatusInternalServerError)
	}
	user.Password = string(hashedpassword)

	user.Id = primitive.NewObjectID()
	result, err := database.UserCollection.InsertOne(context.Background(),user)
	if err != nil {
		http.Error(w,"Encoutered an error", http.StatusInternalServerError)
	}

	json.NewEncoder(w).Encode(result)
}
