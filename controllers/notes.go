package controllers

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/Ashmit-05/notefy/database"
	"github.com/Ashmit-05/notefy/models"
	"github.com/unidoc/unipdf/v3/extractor"
	"github.com/unidoc/unipdf/v3/model"
	"go.mongodb.org/mongo-driver/bson/primitive"
)


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

	fmt.Println("Here's the summary : ", noteText)

	var note models.Notes
	note.Note_id = primitive.NewObjectID()
	note.Text = noteText

	uid := r.FormValue("userid")
	note.UserId, err = primitive.ObjectIDFromHex(uid)
	if err != nil {
		http.Error(w,"Encoutered an unexpected error", http.StatusInternalServerError)
		return
	}

	result, err := database.NotesCollection.InsertOne(context.Background(),note)
	if err != nil {
		http.Error(w,"Encoutered an error", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(result)
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

	fmt.Println(extractedText)
	return []byte(extractedText), nil

}


func getTextSummary(textData []byte) (string, error) {
	requestBody := map[string]interface{} {
		"inputs" : textData,
	}

	// Convert request body to JSON
	requestBodyBytes, err := json.Marshal(requestBody)
	if err != nil {
		return "", err
	}

	// Create a new HTTP request
	req, err := http.NewRequest("POST", "https://api-inference.huggingface.co/models/sshleifer/distilbart-cnn-12-6", bytes.NewBuffer(requestBodyBytes))
	if err != nil {
		return "", err
	}

	// Set headers
	model_token := os.Getenv("MODEL_TOKEN")
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer " + model_token) 

	// Send the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	// Read the response body
	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	return string(responseBody), nil
}
