package handler

import (
	"context"
	"errors"
	"log/slog"
	"mime/multipart"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/MiltonJ23/Midaas/internal/contracts"
	"github.com/MiltonJ23/Midaas/internal/logger"
	"github.com/google/uuid"
)

type contextKey string

const UserIDKey contextKey = "user_id"

var errInvalidFileType = errors.New("file type not allowed")

type UploadHandler struct {
	storage      contracts.ObjectStorageService
	userRepo     contracts.UserRepository
	maxFileSize  int64
	allowedTypes []string
}

func NewUploadHandler(
	storage contracts.ObjectStorageService,
	userRepo contracts.UserRepository,
) *UploadHandler {
	return &UploadHandler{
		storage:     storage,
		userRepo:    userRepo,
		maxFileSize: 10 << 20,
		allowedTypes: []string{
			"image/jpeg",
			"image/png",
			"image/webp",
			"application/pdf",
		},
	}
}

func (h *UploadHandler) UploadIDCard(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	userID, err := userIDFromContext(ctx)
	if err != nil {
		JSONError(w, http.StatusUnauthorized, "authentication required")
		return
	}

	if err := r.ParseMultipartForm(h.maxFileSize); err != nil {
		logger.Warn(ctx, "handler: multipart parse failed", slog.String("error", err.Error()))
		JSONError(w, http.StatusBadRequest, "file too large, max 10MB")
		return
	}

	user, err := h.userRepo.FindByID(ctx, userID)
	if err != nil {
		logger.Error(ctx, "handler: user not found", slog.String("error", err.Error()))
		JSONError(w, http.StatusNotFound, "user not found")
		return
	}

	result := map[string]string{}

	frontFile, frontHeader, err := r.FormFile("front")
	if err == nil {
		defer frontFile.Close()
		frontURL, uploadErr := h.uploadSingle(ctx, frontFile, frontHeader, userID, "id_card_front")
		if uploadErr != nil {
			JSONError(w, http.StatusInternalServerError, "failed to upload front photo")
			return
		}
		user.IdCardUrl = frontURL
		result["front_url"] = frontURL
	}

	backFile, backHeader, err := r.FormFile("back")
	if err == nil {
		defer backFile.Close()
		backURL, uploadErr := h.uploadSingle(ctx, backFile, backHeader, userID, "id_card_back")
		if uploadErr != nil {
			JSONError(w, http.StatusInternalServerError, "failed to upload back photo")
			return
		}
		user.IdCardBackUrl = backURL
		result["back_url"] = backURL
	}

	if len(result) == 0 {
		JSONError(w, http.StatusBadRequest, "at least one photo is required (front or back)")
		return
	}

	if err := h.userRepo.Update(ctx, user); err != nil {
		logger.Error(ctx, "handler: failed to update user", slog.String("error", err.Error()))
		JSONError(w, http.StatusInternalServerError, "failed to update profile")
		return
	}

	logger.Info(ctx, "handler: id card uploaded",
		slog.String("user_id", userID.String()),
	)

	JSON(w, http.StatusOK, result)
}

func (h *UploadHandler) uploadSingle(
	ctx context.Context,
	file multipart.File,
	header *multipart.FileHeader,
	userID uuid.UUID,
	suffix string,
) (string, error) {
	contentType := header.Header.Get("Content-Type")
	if !h.isAllowedType(contentType) {
		return "", errInvalidFileType
	}

	ext := filepath.Ext(header.Filename)
	if ext == "" {
		ext = mimeToExt(contentType)
	}

	key := "midaas-vault/users/" + userID.String() + "/" + suffix + ext

	result, uploadErr := h.storage.Upload(ctx, contracts.UploadInput{
		Key:         key,
		Body:        file,
		ContentType: contentType,
		Size:        header.Size,
		Public:      true,
	})
	if uploadErr != nil {
		logger.Error(ctx, "handler: upload failed",
			slog.String("error", uploadErr.Error()),
			slog.String("side", suffix),
		)
		return "", uploadErr
	}

	return result.URL, nil
}

func (h *UploadHandler) isAllowedType(contentType string) bool {
	contentType = strings.Split(contentType, ";")[0]
	for _, t := range h.allowedTypes {
		if contentType == t {
			return true
		}
	}
	return false
}

func mimeToExt(mime string) string {
	switch strings.Split(mime, ";")[0] {
	case "image/jpeg":
		return ".jpg"
	case "image/png":
		return ".png"
	case "image/webp":
		return ".webp"
	case "application/pdf":
		return ".pdf"
	default:
		return ".bin"
	}
}
