package handler

import (
	"encoding/json"
	"net/http"
)

type Response struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
	Meta    interface{} `json:"meta,omitempty"`
}

func JSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(Response{
		Success: true,
		Data:    data,
	})
}

func JSONError(w http.ResponseWriter, status int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(Response{
		Success: false,
		Error:   message,
	})
}

func JSONPaginated(w http.ResponseWriter, status int, data interface{}, meta interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(Response{
		Success: true,
		Data:    data,
		Meta:    meta,
	})
}

func Decode(r *http.Request, v interface{}) error {
	return json.NewDecoder(r.Body).Decode(v)
}
