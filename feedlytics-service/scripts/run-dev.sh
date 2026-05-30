#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SERVICE_DIR="$(cd "$(dirname "$0")/.." && pwd)"

set -a
# shellcheck source=/dev/null
source "$ROOT/.env.development"
set +a

cd "$SERVICE_DIR"
exec ./mvnw spring-boot:run
