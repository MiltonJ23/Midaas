package storage

import (
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"time"

	"github.com/MiltonJ23/Midaas/internal/contracts"
	"github.com/google/uuid"
)

type LocalStorage struct {
	basePath string
	baseURL  string
}

func NewLocalStorage(basePath, baseURL string) contracts.ObjectStorageService {
	os.MkdirAll(basePath, 0755)
	return &LocalStorage{
		basePath: basePath,
		baseURL:  baseURL,
	}
}

func (s *LocalStorage) Upload(ctx context.Context, input contracts.UploadInput) (*contracts.UploadResult, error) {
	id := uuid.New().String()
	ext := filepath.Ext(input.Key)
	if ext == "" {
		ext = ".bin"
	}
	filename := id + ext
	fullPath := filepath.Join(s.basePath, filename)

	f, err := os.Create(fullPath)
	if err != nil {
		return nil, fmt.Errorf("create file: %w", err)
	}
	defer f.Close()

	if _, err := io.Copy(f, input.Body); err != nil {
		return nil, fmt.Errorf("write file: %w", err)
	}

	url := s.baseURL + "/" + filename

	return &contracts.UploadResult{
		URL: url,
		Key: filename,
	}, nil
}

func (s *LocalStorage) UploadMultiple(ctx context.Context, inputs []contracts.UploadInput) ([]contracts.UploadResult, error) {
	results := make([]contracts.UploadResult, len(inputs))
	for i, input := range inputs {
		result, err := s.Upload(ctx, input)
		if err != nil {
			return nil, fmt.Errorf("upload %d: %w", i, err)
		}
		results[i] = *result
	}
	return results, nil
}

func (s *LocalStorage) Delete(ctx context.Context, key string) error {
	fullPath := filepath.Join(s.basePath, key)
	return os.Remove(fullPath)
}

func (s *LocalStorage) GetSignedURL(ctx context.Context, key string, expiry time.Duration) (string, error) {
	return s.baseURL + "/" + key, nil
}
