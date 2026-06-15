.PHONY: build build-dev run run-dev dev clean test lint tidy all

APP_NAME = midaas-api
BIN_DIR  = bin

build:
	@echo "==> Building $(APP_NAME) (production)..."
	CGO_ENABLED=0 go build -tags netgo -ldflags '-s -w' -o $(BIN_DIR)/$(APP_NAME) ./cmd

build-dev:
	@echo "==> Building $(APP_NAME) (dev)..."
	go build -o $(BIN_DIR)/$(APP_NAME) ./cmd

run: build
	@echo "==> Starting $(APP_NAME)..."
	./$(BIN_DIR)/$(APP_NAME)

run-dev: build-dev
	@echo "==> Starting $(APP_NAME) (dev)..."
	LOG_LEVEL=debug ./$(BIN_DIR)/$(APP_NAME)

dev:
	@echo "==> Starting in dev mode..."
	LOG_LEVEL=debug go run ./cmd

clean:
	@echo "==> Cleaning..."
	rm -rf $(BIN_DIR)

test:
	@echo "==> Running tests..."
	go test -v -race ./...

lint:
	@echo "==> Running linters..."
	go vet ./...

tidy:
	@echo "==> Tidying modules..."
	go mod tidy

all: lint test build
