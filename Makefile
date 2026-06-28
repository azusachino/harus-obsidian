# Quartz task runner. mise manages tools; make runs tasks.

PORT        ?= 8080
WS_PORT     ?= 3001
CONCURRENCY ?= 8
QUARTZ      := npx quartz

.DEFAULT_GOAL := help

.PHONY: help build serve local check format test update init install-plugins clean

help: ## List available targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

build: ## Build the site to public/
	$(QUARTZ) build --concurrency $(CONCURRENCY)

serve: ## Build and serve on all interfaces (0.0.0.0 / ::1), default port 8080
	$(QUARTZ) build --serve --port $(PORT) --wsPort $(WS_PORT) --concurrency $(CONCURRENCY)

local: serve ## Alias for serve

check: ## Type-check and verify formatting
	npm run check

format: ## Auto-format with Prettier
	npm run format

test: ## Run tests
	npm run test

install-plugins: ## Install plugins from quartz.config.yaml
	npm run install-plugins

update: ## Update Quartz from upstream
	$(QUARTZ) update

init: ## Scaffold a new Quartz project
	$(QUARTZ) create

clean: ## Remove build output
	rm -rf public .quartz-cache
