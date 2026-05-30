.PHONY: dev down logs ps build prod-up prod-down prod-logs prod-build prod-pull prod-push

COMPOSE_DEV := docker compose -f docker-compose.dev.yml
COMPOSE_PROD := docker compose --env-file prod/.env -f docker-compose.yml

dev:
	$(COMPOSE_DEV) up --build

down:
	$(COMPOSE_DEV) down -v

logs:
	$(COMPOSE_DEV) logs -f

ps:
	$(COMPOSE_DEV) ps

build:
	$(COMPOSE_DEV) build --no-cache

prod-up:
	$(COMPOSE_PROD) up -d --build

prod-down:
	$(COMPOSE_PROD) down

prod-logs:
	$(COMPOSE_PROD) logs -f

prod-build:
	$(COMPOSE_PROD) build

prod-pull:
	$(COMPOSE_PROD) pull

prod-push:
	./scripts/build-and-push.sh
