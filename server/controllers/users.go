package controllers

import (
	"context"
	"encoding/json"
	"io"
	"net/http"

	"github.com/Ashmit-05/notefy/database"
	"github.com/Ashmit-05/notefy/middlewares"
	"github.com/Ashmit-05/notefy/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

type response struct {
	StatusCode int
	Message string
	UserId primitive.ObjectID
}

func SignUp(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type","application/json")
	w.Header().Set("Allow-Control-Allow-Methods","POST")

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w,"Failed to read request body", http.StatusBadRequest)
		return
	}

	var user models.User
	err = json.Unmarshal(body,&user)
	if err != nil {
		http.Error(w,"Unable to parse JSON",http.StatusBadRequest)
		return
	}

	if err := middlewares.CheckUserData(user); err != nil {
		http.Error(w,err.Error(),http.StatusBadRequest)
		return
	}

	if _, exists := middlewares.CheckIfUserExists(user.Email); exists {
		http.Error(w,"User already exists", http.StatusConflict)
		return
	}

	hashedpassword, err := bcrypt.GenerateFromPassword([]byte(user.Password),10)
	if err != nil {
		http.Error(w,"An error occured", http.StatusInternalServerError)
		return
	}
	user.Password = string(hashedpassword)

	user.Id = primitive.NewObjectID()
	result, err := database.UserCollection.InsertOne(context.Background(),user)
	if err != nil {
		http.Error(w,"Encoutered an error", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(result)
}

func SignIn(w http.ResponseWriter,r *http.Request) {
	w.Header().Set("Content-type","application/json")
	w.Header().Set("Allow-Control-Allow-Methods","POST")

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w,"Failed to read request body", http.StatusBadRequest)
		return
	}

	var user models.User
	err = json.Unmarshal(body,&user)

	userdata, exists := middlewares.CheckIfUserExists(user.Email)

	if !exists {
		http.Error(w,"User does not exist",http.StatusBadRequest)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(userdata.Password),[]byte(user.Password))
	if err != nil {
		http.Error(w,"Incorrect Password",http.StatusBadRequest)
		return
	}

	resp := response{
		200,
		"Successfully logged in",
		userdata.Id,
	}

	json.NewEncoder(w).Encode(resp)
}
