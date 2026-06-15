package router

import (
	"log/slog"
	"net/http"

	"github.com/MiltonJ23/Midaas/internal/endpoints/handler"
	"github.com/MiltonJ23/Midaas/internal/endpoints/middleware"
)

func New(
	log *slog.Logger,
	authHandler *handler.AuthHandler,
	uploadHandler *handler.UploadHandler,
) http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("POST /api/v1/auth/register", authHandler.Register)
	mux.HandleFunc("POST /api/v1/auth/login", authHandler.Login)

	mux.Handle("POST /api/v1/auth/entrepreneur", middleware.AuthRequired(
		http.HandlerFunc(authHandler.BecomeEntrepreneur),
	))
	mux.Handle("GET /api/v1/auth/me", middleware.AuthRequired(
		http.HandlerFunc(authHandler.Me),
	))

	mux.Handle("POST /api/v1/upload/id-card", middleware.AuthRequired(
		http.HandlerFunc(uploadHandler.UploadIDCard),
	))

	mux.HandleFunc("GET /api/v1/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok"}`))
	})

	var h http.Handler = mux
	h = middleware.RequestID(h)
	h = middleware.RequestLogger(log)(h)

	return h
}
