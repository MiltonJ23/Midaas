package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
)

type CompanyOperations struct {
	ID                       uuid.UUID      `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	CompanyID                uuid.UUID      `gorm:"type:uuid;uniqueIndex;not null" json:"company_id"`
	TopSuppliers             datatypes.JSON `gorm:"type:jsonb" json:"top_suppliers"`
	TopClients               datatypes.JSON `gorm:"type:jsonb" json:"top_clients"`
	CollateralType           string         `json:"collateral_type"`
	CollateralProofDocs      datatypes.JSON `gorm:"type:jsonb" json:"collateral_proof_docs"`
	ContinuityInfrastructure string         `gorm:"type:text" json:"continuity_infrastructure"`
	CreatedAt                time.Time      `json:"created_at"`
	UpdatedAt                time.Time      `json:"updated_at"`

	Company *Company `gorm:"foreignKey:CompanyID" json:"-"`
}
