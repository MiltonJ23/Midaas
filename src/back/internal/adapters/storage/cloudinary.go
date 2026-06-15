package storage

import (
	"context"
	"fmt"
	"io"
	"time"

	"github.com/MiltonJ23/Midaas/internal/contracts"
	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

type CloudinaryStorage struct {
	cld *cloudinary.Cloudinary
}

func NewCloudinaryStorage(cloudName, apiKey, apiSecret string) (contracts.ObjectStorageService, error) {
	cld, err := cloudinary.NewFromURL(
		fmt.Sprintf("cloudinary://%s:%s@%s", apiKey, apiSecret, cloudName),
	)
	if err != nil {
		return nil, fmt.Errorf("cloudinary init: %w", err)
	}
	return &CloudinaryStorage{cld: cld}, nil
}

func (s *CloudinaryStorage) Upload(ctx context.Context, input contracts.UploadInput) (*contracts.UploadResult, error) {
	overwrite := true
	resp, err := s.cld.Upload.Upload(ctx, input.Body, uploader.UploadParams{
		PublicID:     input.Key,
		Folder:       "",
		ResourceType: "auto",
		Overwrite:    &overwrite,
	})
	if err != nil {
		return nil, fmt.Errorf("cloudinary upload: %w", err)
	}

	return &contracts.UploadResult{
		URL: resp.SecureURL,
		Key: resp.PublicID,
	}, nil
}

func (s *CloudinaryStorage) UploadMultiple(ctx context.Context, inputs []contracts.UploadInput) ([]contracts.UploadResult, error) {
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

func (s *CloudinaryStorage) Delete(ctx context.Context, key string) error {
	_, err := s.cld.Upload.Destroy(ctx, uploader.DestroyParams{
		PublicID: key,
	})
	if err != nil {
		return fmt.Errorf("cloudinary delete: %w", err)
	}
	return nil
}

func (s *CloudinaryStorage) GetSignedURL(ctx context.Context, key string, expiry time.Duration) (string, error) {
	return "", fmt.Errorf("signed URLs not implemented for cloudinary direct uploads")
}

func (s *CloudinaryStorage) uploadReader(ctx context.Context, reader io.Reader, params uploader.UploadParams) (string, error) {
	resp, err := s.cld.Upload.Upload(ctx, reader, params)
	if err != nil {
		return "", err
	}
	return resp.SecureURL, nil
}
