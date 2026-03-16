.PHONY: help run migrate makemigrations test shell_plus print-shell createsuperuser clean install lint fmt

# Default target
help:
	@echo "Available commands:"
	@echo "  make run        - Run Django development server"
	@echo "  make migrate          - Apply database migrations"
	@echo "  make makemigrations   - Create new migrations"
	@echo "  make test             - Run tests"
	@echo "  make shell            - Open Django shell (shell_plus)"
	@echo "  make print-shell      - Open Django shell (shell_plus) with print-sql"
	@echo "  make createsuperuser  - Create superuser"
	@echo "  make clean            - Remove Python cache files"
	@echo "  make install          - Install dependencies with uv"
	@echo "  make lint             - Run ruff lint"
	@echo "  make fmt              - Auto-fix with ruff"

# Run Django development server
run:
	uv run python manage.py runserver 0.0.0.0:8000

# Apply migrations
migrate:
	uv run python manage.py migrate

# Create migrations
migrations:
	uv run python manage.py makemigrations

# Run tests
test:
	uv run python manage.py test

# Open Django shell (shell_plus)
shell:
	uv run python manage.py shell_plus

print-shell:
	uv run python manage.py shell_plus --print-sql


# Create superuser
createsuperuser:
	uv run python manage.py createsuperuser

# Clean Python cache files
clean:
	find . -type d -name __pycache__ -exec rm -r {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete

# Install dependencies
install:
	uv sync

# Lint (Ruff)
lint:
	uv run ruff check .

# Format (Ruff)
fmt:
	uv run ruff check . --fix

