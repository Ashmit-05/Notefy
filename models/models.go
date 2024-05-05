package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	Id primitive.ObjectID `json:"_id" bson:"_id"`
	Name string `json:"name" validate:"required,min=3,max=40"`
	Email string `json:"email" validate:"email,required"`
	Password string `json:"password" validate:"required,min=8"`
	Notes []Notes `json:"notes"`
	Category []string `json:"category"`
}

type Notes struct {
	Note_id primitive.ObjectID `bson:"_id"`
	Category string `json:"category"`
	Text string `json:"text"`
}
