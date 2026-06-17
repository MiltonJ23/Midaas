package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

const (
	AdminRoleSuperAdmin = "super_admin"
	AdminRoleModerator  = "moderator"
)

type Admin struct {
	ID           uuid.UUID      `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Email        string         `gorm:"uniqueIndex;not null" json:"email"`
	HashPassword string         `gorm:"not null" json:"-"`
	FullName     string         `gorm:"not null" json:"full_name"`
	Role         string         `gorm:"not null;default:moderator" json:"role"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}
