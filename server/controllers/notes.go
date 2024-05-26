package controllers

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/Ashmit-05/notefy/database"
	"github.com/Ashmit-05/notefy/middlewares"
	"github.com/Ashmit-05/notefy/models"
	"github.com/unidoc/unipdf/v3/extractor"
	"github.com/unidoc/unipdf/v3/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	// "golang.org/x/text"
)

type UserNotes struct {
    Notes []models.Notes `json:"notes" bson:"notes"`
}

type Message struct {
	Content string `json:"content"`
	Role    string `json:"role"`
}

type Choice struct {
	Message Message `json:"message"`
}

type APIResponse struct {
	Choices []Choice `json:"choices"`
}

func CreateNote(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type","application/json")
	w.Header().Set("Allow-Control-Allow-Methods","POST")
	textData, err := extractTextFromPDF(r)
	if err != nil {
		http.Error(w, "Unexpected error. Please try again later", http.StatusInternalServerError)
		return
	}

	noteText, err := getTextSummary([]byte(textData))
	if err != nil {
		http.Error(w, "Unexpected error. Please try again later", http.StatusInternalServerError)
		return
	}

	// fmt.Println("Here's the summary : ", noteText)
	file, fileHeader, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Unexpected error. Please try again later", http.StatusInternalServerError)
		return
	}
	defer file.Close()

	var note models.Notes
	note.Note_id = primitive.NewObjectID()
	note.Text = noteText
	note.Title = fileHeader.Filename

	uid := r.FormValue("userid")
	note.UserId, err = primitive.ObjectIDFromHex(uid)
	user, err := middlewares.GetUser(note.UserId)
	fmt.Println("user : ",user)
	if err != nil {
		http.Error(w,"Encoutered an error", http.StatusInternalServerError)
		return
	}
	user.Notes = append(user.Notes, note)
	filter := bson.M{"_id":note.UserId}
	update := bson.M{"$set":user}
	userUpdateResult := database.UserCollection.FindOneAndUpdate(
		context.Background(),
		filter,
		update,
	)

	fmt.Println(userUpdateResult)
	result, err := database.NotesCollection.InsertOne(context.Background(),note)
	fmt.Println("result : ",result)
	if err != nil {
		http.Error(w,"Encoutered an error", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(result)
}

func GetNotes(w http.ResponseWriter,r *http.Request) {
	w.Header().Set("Content-type","application/json")
	w.Header().Set("Access-Control-Allow-Methods","GET")

	userid := r.FormValue("userid")
	id,err := primitive.ObjectIDFromHex(userid)
	if err != nil {
		http.Error(w,"Encoutered an error", http.StatusInternalServerError)
		return
	}
	filter := bson.M{"_id":id}
	projection := bson.M{"notes": 1, "_id": 0}
	var user UserNotes
	err = database.UserCollection.FindOne(
		context.Background(),filter,
		options.FindOne().SetProjection(projection),
	).Decode(&user)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w,"User not found",http.StatusNotFound)
		} else {
			http.Error(w,"Encountered an error", http.StatusInternalServerError)
		}
		return
	}

	json.NewEncoder(w).Encode(user.Notes)
}

// helper functions
func extractTextFromPDF(r *http.Request) ([]byte,error) {
	// Parse the uploaded PDF file from the request
	file, _, err := r.FormFile("file")
	if err != nil {
		return nil, err
	}
	defer file.Close()

	// Read the contents of the PDF file
	pdfData, err := io.ReadAll(file)
	if err != nil {
		return nil, err
	}

	// Create a new PDF reader from the PDF data
	pdfReader, err := model.NewPdfReader(bytes.NewReader(pdfData))
	if err != nil {
		return nil, err
	}

	numPages, err := pdfReader.GetNumPages()
	if err != nil {
		return nil, err
	}

	var extractedText string
	for i := 0; i < numPages; i++ {
		pageNum := i + 1

		page, err := pdfReader.GetPage(pageNum)
		if err != nil {
			return nil, err
		}

		ex, err := extractor.New(page)
		if err != nil {
			return nil, err
		}

		text, err := ex.ExtractText()
		if err != nil {
			return nil, err
		}

		// extractedText += fmt.Sprintf("------------------------------\nPage %d:\n%s\n------------------------------\n", pageNum, text)
		extractedText += text
	}
	// fmt.Println("hello")
	// fmt.Println(extractedText)
	return []byte(extractedText), nil

}


func getTextSummary(textData []byte) (string, error) {

	prompt := string(textData)
	chunks := chunkString(prompt, 10000)

	err := ioutil.WriteFile("prompt.txt", []byte(prompt), 0644)
    if err != nil {
        log.Fatalf("Failed writing to file: %s", err)
    }

	finalResponse :=""

	for _, chunk := range chunks {
			requestBody := map[string]interface{}{
		"messages": []map[string]interface{}{
			{
				"role":    "system",
				"content":"you are a document summarizer. Summarize the following text: "+chunk,
			},
		},
		"max_tokens":        6000,
		"temperature":       0.7,
		"frequency_penalty": 0,
		"presence_penalty":  0,
		"top_p":             0.95,
		"stop":              nil,
	}

	// Convert request body to JSON
	requestBodyBytes, err := json.Marshal(requestBody)
	if err != nil {
		return "", err
	}

	// Create a new HTTP request
	req, err := http.NewRequest("POST", "https://curiositycreator.openai.azure.com/openai/deployments/curiositycreator/chat/completions?api-version=2024-02-15-preview", bytes.NewBuffer(requestBodyBytes))
	if err != nil {
		return "", err
	}


	// Set headers
	// model_token := os.Getenv("MODEL_TOKEN")
	api_key := os.Getenv("API_KEY")
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("api-key" ,api_key)

	// Send the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

// Assuming resp is your map

	// Read the response body
	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var apiResponse APIResponse
	err = json.Unmarshal(responseBody,&apiResponse)
	if err != nil {
		return "",fmt.Errorf("error in unmarshalling json : %w",err)
	}

	for _, choice := range apiResponse.Choices {
		finalResponse += choice.Message.Content
	}
}
return finalResponse,nil

}

func chunkString(s string, chunkSize int) []string {
    var chunks []string

    runeStr := []rune(s)
    strLen := len(runeStr)

    for i := 0; i < strLen; i += chunkSize {
        end := i + chunkSize

        if end > strLen {
            end = strLen
        }

        chunks = append(chunks, string(runeStr[i:end]))
    }

    return chunks
}
