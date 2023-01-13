export COMPOSE_PROJECT_NAME=epic1h-livemd

COMPOSE_ARGS=-f tools/compose/docker-compose.yml

# -- npm --

install:
	@npm install

# -- precommit --

pre-commit:
	@pre-commit

pre-commit-install:
	@pre-commit install
	@pre-commit install --hook-type commit-msg

pre-commit-update:
	@pre-commit autoupdate

# -- docker --

up:
	docker compose ${COMPOSE_ARGS} up --remove-orphans
