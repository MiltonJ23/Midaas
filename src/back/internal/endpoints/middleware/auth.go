package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/MiltonJ23/Midaas/internal/endpoints/handler"
)

func AuthRequired(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token := extractToken(r)
		if token == "" {
			handler.JSONError(w, http.StatusUnauthorized, "authentication required")
			return
		}

		userID, err := parseSimpleToken(token)
		if err != nil {
			handler.JSONError(w, http.StatusUnauthorized, "invalid token")
			return
		}

		ctx := context.WithValue(r.Context(), handler.UserIDKey, userID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func extractToken(r *http.Request) string {
	if auth := r.Header.Get("Authorization"); auth != "" {
		if strings.HasPrefix(auth, "Bearer ") {
			return strings.TrimPrefix(auth, "Bearer ")
		}
		return auth
	}
	return r.URL.Query().Get("token")
}

func parseSimpleToken(token string) (string, error) {
	idx := strings.LastIndex(token, ".")
	if idx == -1 {
		return "", http.ErrNoCookie
	}
	return token[idx+1:], nil
}
