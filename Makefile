# ===========================================
# Al-Haramain Store Frontend - Development Commands
# ===========================================
# Run: make <command>
# ===========================================

.PHONY: help dev dev-build dev-down dev-logs dev-shell prod-build prod-test clean

# Default target - show help
help:
	@echo "===========================================
	@echo " Al-Haramain Store Frontend - Commands"
	@echo "==========================================="
	@echo ""
	@echo " Development (standalone):"
	@echo "   make dev          - Start dev server in Docker"
	@echo "   make dev-build    - Rebuild and start dev server"
	@echo "   make dev-down     - Stop dev server"
	@echo "   make dev-logs     - View dev server logs"
	@echo "   make dev-shell    - Open shell in container"
	@echo ""
	@echo " Production Testing:"
	@echo "   make prod-build   - Build production image"
	@echo "   make prod-test    - Run production build locally"
	@echo ""
	@echo " Utilities:"
	@echo "   make clean        - Remove Docker artifacts"
	@echo "   make install      - Install npm dependencies"
	@echo ""
	@echo " NOTE: For full-stack development, use:"
	@echo "   cd ../Al-Haramain-Store && make dev"
	@echo "==========================================="

# ===========================================
# Development (Standalone)
# ===========================================

# Start development server
dev:
	docker-compose up

# Rebuild and start
dev-build:
	docker-compose up --build

# Stop development server
dev-down:
	docker-compose down

# View logs
dev-logs:
	docker-compose logs -f

# Shell into container
dev-shell:
	docker-compose exec frontend sh

# ===========================================
# Production Testing
# ===========================================

# Build production image
prod-build:
	docker build -t alharamain-frontend:latest \
		--build-arg VITE_API_BASE_URL=$${VITE_API_BASE_URL:-http://localhost:80} \
		--build-arg VITE_SESSION_DOMAIN=$${VITE_SESSION_DOMAIN:-localhost} \
		--build-arg VITE_STRIPE_PUBLISHABLE_KEY=$${VITE_STRIPE_PUBLISHABLE_KEY:-} \
		.

# Run production build locally (port 8000)
prod-test: prod-build
	docker run --rm -p 8000:80 --name alharamain-frontend-test alharamain-frontend:latest

# ===========================================
# Utilities
# ===========================================

# Clean Docker artifacts
clean:
	docker-compose down -v --rmi local
	docker image prune -f

# Install npm dependencies (local, not Docker)
install:
	npm ci --legacy-peer-deps
