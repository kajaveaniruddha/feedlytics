.PHONY: dev down build logs ps

dev:
	docker-compose -f docker-compose.dev.yml up --watch --build

down:
	docker-compose -f docker-compose.dev.yml down -v

logs:
	docker-compose -f docker-compose.dev.yml logs -f

ps:
	docker-compose -f docker-compose.dev.yml ps

build:
	docker-compose -f docker-compose.dev.yml build --no-cache
