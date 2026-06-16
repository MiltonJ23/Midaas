package middleware

import (
	"context"
	"log/slog"
	"net/http"

	"github.com/MiltonJ23/Midaas/internal/contracts"
	"github.com/MiltonJ23/Midaas/internal/domain"
	"github.com/MiltonJ23/Midaas/internal/endpoints/handler"
	"github.com/MiltonJ23/Midaas/internal/logger"
	"github.com/google/uuid"
)

func EntrepreneurRequired(entrepRepo contracts.EntrepreneurRepository) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			userIDStr, ok := r.Context().Value(handler.UserIDKey).(string)
			if !ok {
				handler.JSONError(w, http.StatusUnauthorized, "authentication required")
				return
			}

			userID, err := uuid.Parse(userIDStr)
			if err != nil {
				handler.JSONError(w, http.StatusUnauthorized, "invalid user id")
				return
			}

			entrep, err := entrepRepo.FindByUserID(r.Context(), userID)
			if err != nil || entrep == nil {
				handler.JSONError(w, http.StatusForbidden, "entrepreneur profile required")
				return
			}

			if entrep.Status != domain.EntrepreneurStatusActive {
				logger.Warn(r.Context(), "middleware: entrepreneur not active",
					slog.String("user_id", userIDStr),
					slog.String("status", entrep.Status),
				)
				handler.JSONError(w, http.StatusForbidden, "entrepreneur account is not yet approved")
				return
			}

			ctx := context.WithValue(r.Context(), handler.EntrepIDKey, entrep.ID.String())
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
