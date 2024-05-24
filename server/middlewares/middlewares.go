package middlewares

import (
	"context"
	"errors"
	"log"

	"github.com/Ashmit-05/notefy/database"
	"github.com/Ashmit-05/notefy/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func CheckIfUserExists(email string) (*models.User,bool) {
	filter := bson.M{"email":email}
	var user models.User
	err := database.UserCollection.FindOne(context.Background(),filter).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return &user,false
		}
		log.Printf("error in checking database for given email : %s",err)
	}
	return &user,true
}

func CheckUserData(user models.User) error {
	if user.Email == "" || user.Name == "" || user.Password == "" {
		return errors.New("incorrect data. need to provide email, name and password")
	}
	return nil
}

func GetUser(id primitive.ObjectID) (models.User, error) {
	filter := bson.M{"_id":id}
	var user models.User
	err := database.UserCollection.FindOne(context.Background(),filter).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return user,err
		}
		log.Printf("error in checking database for given email : %s",err)
	}
	return user,nil

}
