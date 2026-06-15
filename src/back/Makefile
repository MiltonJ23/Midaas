.PHONY: build run clean test lint dev

APP_NAME = midaas-api
BIN_DIR  = bin

build:
	@echo "==> Building $(APP_NAME)..."
	go build -o $(BIN_DIR)/$(APP_NAME) ./cmd

run: build
	@echo "==> Starting $(APP_NAME)..."
	./$(BIN_DIR)/$(APP_NAME)

dev:
	@echo "==> Starting in dev mode (hot-reload)..."
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
