# domain

Midaas domain models — GORM entities mapped to PostgreSQL.

## Tables

### users

| Column          | Type        | PK | Notes                         |
|-----------------|-------------|----|-------------------------------|
| id              | uuid        | *  | gen_random_uuid()             |
| email           | string      |    | unique, not null              |
| phone_number    | string      |    |                               |
| hash_password   | string      |    | not null, json hidden (-)     |
| full_name       | string      |    | not null                      |
| id_card_url     | string      |    | object store URL              |
| id_card_number  | string      |    |                               |
| created_at      | timestamp   |    |                               |
| updated_at      | timestamp   |    |                               |
| deleted_at      | timestamp   |    | soft delete (indexed)         |

### entrepreneurs

| Column     | Type      | PK | Notes                            |
|------------|-----------|----|----------------------------------|
| id         | uuid      | *  | gen_random_uuid()                |
| user_id    | uuid      |    | FK -> users.id (unique, not null)|
| created_at | timestamp |    |                                  |
| updated_at | timestamp |    |                                  |

1:1 with User. Represents a user onboarded as a business owner.

### companies

| Column           | Type      | PK | Notes                                     |
|------------------|-----------|----|-------------------------------------------|
| id               | uuid      | *  | gen_random_uuid()                         |
| legal_name       | string    |    | not null                                  |
| trade_name       | string    |    | DBA / brand name                          |
| corporate_form   | string    |    | not null (ETS, SARL, SA, SAS)             |
| industry_sector  | string    |    |                                           |
| gps_coordinates  | string    |    |                                           |
| physical_address | text      |    |                                           |
| created_at       | timestamp |    |                                           |
| updated_at       | timestamp |    |                                           |
| deleted_at       | timestamp |    | soft delete (indexed)                     |

HasOne: legal_docs, financials, operations.
HasMany: beneficial_owners, managers.

### company_legal_docs

| Column                | Type      | PK | Notes                                  |
|-----------------------|-----------|----|----------------------------------------|
| id                    | uuid      | *  | gen_random_uuid()                      |
| company_id            | uuid      |    | FK -> companies.id (unique, not null)  |
| rccm_number           | string    |    |                                        |
| rccm_expiry_date      | date?     |    | nullable                               |
| rccm_docs             | jsonb     |    | string[] — object URLs                 |
| niu_number            | string    |    |                                        |
| niu_doc_url           | string    |    | single object URL                      |
| statuts_docs          | jsonb     |    | string[] — object URLs                 |
| localisation_doc_url  | string    |    | single object URL                      |
| premises_photos       | jsonb     |    | string[] — object URLs                 |
| sector_permits        | jsonb     |    | string[] — object URLs                 |
| created_at            | timestamp |    |                                        |
| updated_at            | timestamp |    |                                        |

1:1 with Company.

### company_financials

| Column              | Type      | PK | Notes                                  |
|---------------------|-----------|----|----------------------------------------|
| id                  | uuid      | *  | gen_random_uuid()                      |
| company_id          | uuid      |    | FK -> companies.id (unique, not null)  |
| dsf_years           | jsonb     |    | int[] — e.g. [2024, 2025]              |
| dsf_stamped_docs    | jsonb     |    | string[] — object URLs                 |
| anr_issue_date      | date?     |    | nullable                               |
| anr_expiry_date     | date?     |    | nullable, flag if > 3 months old       |
| anr_doc_url         | string    |    | single object URL                      |
| cnps_clearance_url  | string    |    | single object URL                      |
| bank_statements     | jsonb     |    | string[] — object URLs                 |
| momo_statements     | jsonb     |    | string[] — object URLs                 |
| created_at          | timestamp |    |                                        |
| updated_at          | timestamp |    |                                        |

1:1 with Company.

### beneficial_owners

| Column            | Type      | PK | Notes                                  |
|-------------------|-----------|----|----------------------------------------|
| id                | uuid      | *  | gen_random_uuid()                      |
| company_id        | uuid      |    | FK -> companies.id (indexed, not null) |
| full_name         | string    |    | not null                               |
| equity_percentage | float64   |    |                                        |
| identity_docs     | jsonb     |    | string[] — object URLs (CNI/passport)  |
| created_at        | timestamp |    |                                        |
| updated_at        | timestamp |    |                                        |

N:1 with Company (BelongsTo).

### company_managers

| Column                 | Type      | PK | Notes                                  |
|------------------------|-----------|----|----------------------------------------|
| id                     | uuid      | *  | gen_random_uuid()                      |
| company_id             | uuid      |    | FK -> companies.id (indexed, not null) |
| full_name              | string    |    | not null                               |
| role                   | string    |    | e.g. Gerant, Directeur General         |
| identity_docs          | jsonb     |    | string[] — object URLs                 |
| casier_judiciaire_url  | string    |    | single object URL                      |
| casier_judiciaire_date | date?     |    | nullable, must be < 3 months old       |
| cv_url                 | string    |    | single object URL                      |
| created_at             | timestamp |    |                                        |
| updated_at             | timestamp |    |                                        |

N:1 with Company (BelongsTo).

### company_operations

| Column                    | Type      | PK | Notes                                  |
|---------------------------|-----------|----|----------------------------------------|
| id                        | uuid      | *  | gen_random_uuid()                      |
| company_id                | uuid      |    | FK -> companies.id (unique, not null)  |
| top_suppliers             | jsonb     |    | JSON object                            |
| top_clients               | jsonb     |    | JSON object                            |
| collateral_type           | string    |    |                                        |
| collateral_proof_docs     | jsonb     |    | string[] — object URLs                 |
| continuity_infrastructure | text      |    |                                        |
| created_at                | timestamp |    |                                        |
| updated_at                | timestamp |    |                                        |

1:1 with Company.

## Relations

```
User 1---1 Entrepreneur
Company 1---1 CompanyLegalDocs
Company 1---1 CompanyFinancials
Company 1---1 CompanyOperations
Company 1---* BeneficialOwner
Company 1---* CompanyManager
```

## Conventions

- `jsonb` columns hold `[]string` (object URLs) or `[]int` (years).
- `date?` columns use `*time.Time` — nullable in Go, NULL in SQL.
- Soft deletes on `users` and `companies` only.
- All PKs are UUID v4 via `gen_random_uuid()`.
- JSON fields use `gorm.io/datatypes.JSON`.
