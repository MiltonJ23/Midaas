package postgres

import (
	"context"

	"github.com/MiltonJ23/Midaas/internal/contracts"
	"github.com/MiltonJ23/Midaas/internal/domain"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type projectRepository struct {
	db *gorm.DB
}

func NewProjectRepository(db *gorm.DB) contracts.ProjectRepository {
	return &projectRepository{db: db}
}

func (r *projectRepository) Create(ctx context.Context, p *domain.Project) error {
	return r.db.WithContext(ctx).Create(p).Error
}

func (r *projectRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.Project, error) {
	var p domain.Project
	err := r.db.WithContext(ctx).First(&p, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *projectRepository) FindByIDWithRelations(ctx context.Context, id uuid.UUID) (*domain.Project, error) {
	var p domain.Project
	err := r.db.WithContext(ctx).
		Preload("Company").
		Preload("Entrepreneur").
		Preload("Milestones").
		Preload("Investments").
		First(&p, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *projectRepository) List(ctx context.Context, filter contracts.ProjectFilter) ([]domain.Project, int64, error) {
	var list []domain.Project
	var total int64

	query := r.db.WithContext(ctx).Model(&domain.Project{})

	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
	}
	if filter.Category != "" {
		query = query.Where("category = ?", filter.Category)
	}
	if filter.Currency != "" {
		query = query.Where("currency = ?", filter.Currency)
	}
	if filter.MinGoal > 0 {
		query = query.Where("funding_goal >= ?", filter.MinGoal)
	}
	if filter.MaxGoal > 0 {
		query = query.Where("funding_goal <= ?", filter.MaxGoal)
	}
	if filter.Query != "" {
		q := "%" + filter.Query + "%"
		query = query.Where("title ILIKE ? OR description ILIKE ?", q, q)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if filter.PageSize <= 0 {
		filter.PageSize = 20
	}
	if filter.Page <= 1 {
		filter.Page = 1
	}
	offset := (filter.Page - 1) * filter.PageSize

	err := query.Order("created_at DESC").
		Offset(offset).
		Limit(filter.PageSize).
		Preload("Company").
		Find(&list).Error

	return list, total, err
}

func (r *projectRepository) ListByEntrepreneur(ctx context.Context, eID uuid.UUID) ([]domain.Project, error) {
	var list []domain.Project
	err := r.db.WithContext(ctx).Where("entrepreneur_id = ?", eID).
		Order("created_at DESC").Find(&list).Error
	return list, err
}

func (r *projectRepository) ListByCompany(ctx context.Context, companyID uuid.UUID) ([]domain.Project, error) {
	var list []domain.Project
	err := r.db.WithContext(ctx).Where("company_id = ?", companyID).
		Order("created_at DESC").Find(&list).Error
	return list, err
}

func (r *projectRepository) Update(ctx context.Context, p *domain.Project) error {
	return r.db.WithContext(ctx).Save(p).Error
}

type milestoneRepository struct {
	db *gorm.DB
}

func NewMilestoneRepository(db *gorm.DB) contracts.MilestoneRepository {
	return &milestoneRepository{db: db}
}

func (r *milestoneRepository) Create(ctx context.Context, m *domain.Milestone) error {
	return r.db.WithContext(ctx).Create(m).Error
}

func (r *milestoneRepository) CreateBatch(ctx context.Context, milestones []domain.Milestone) error {
	return r.db.WithContext(ctx).Create(&milestones).Error
}

func (r *milestoneRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.Milestone, error) {
	var m domain.Milestone
	err := r.db.WithContext(ctx).First(&m, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &m, nil
}

func (r *milestoneRepository) ListByProject(ctx context.Context, projectID uuid.UUID) ([]domain.Milestone, error) {
	var list []domain.Milestone
	err := r.db.WithContext(ctx).
		Where("project_id = ?", projectID).
		Order("order_num ASC").
		Find(&list).Error
	return list, err
}

func (r *milestoneRepository) ListPending(ctx context.Context) ([]domain.Milestone, error) {
	var list []domain.Milestone
	err := r.db.WithContext(ctx).
		Where("status = ?", domain.MilestoneStatusUnderReview).
		Order("created_at ASC").
		Find(&list).Error
	return list, err
}

func (r *milestoneRepository) Update(ctx context.Context, m *domain.Milestone) error {
	return r.db.WithContext(ctx).Save(m).Error
}

func (r *milestoneRepository) FindNextPending(ctx context.Context, projectID uuid.UUID) (*domain.Milestone, error) {
	var m domain.Milestone
	err := r.db.WithContext(ctx).
		Where("project_id = ? AND status = ?", projectID, domain.MilestoneStatusPending).
		Order("order_num ASC").
		First(&m).Error
	if err != nil {
		return nil, err
	}
	return &m, nil
}
