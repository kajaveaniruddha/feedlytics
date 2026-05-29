#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -f prod/.env ]]; then
  set -a
  # shellcheck source=/dev/null
  source prod/.env
  set +a
fi

DOCKER_USERNAME="${DOCKER_USERNAME:-aniii1802}"
TAG="${TAG:-latest}"

build_and_push() {
  local name="$1"
  local context="$2"
  shift 2
  local -a build_args=()
  for arg in "$@"; do
    build_args+=(--build-arg "$arg")
  done

  echo "==> Building ${DOCKER_USERNAME}/${name}:${TAG}"
  docker build "${build_args[@]}" -f "${context}/Dockerfile" -t "${DOCKER_USERNAME}/${name}:${TAG}" "${context}"
  docker push "${DOCKER_USERNAME}/${name}:${TAG}"
}

build_and_push feedlytics-queue-service ./feedlytics-queue-service
build_and_push feedlytics-service ./feedlytics-service
build_and_push feedlytics-dashboard ./feedlytics-dashboard \
  "NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL:-https://api.feedlytics.in}" \
  "NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}" \
  "NEXT_PUBLIC_ENABLE_MSW=${NEXT_PUBLIC_ENABLE_MSW:-false}"
build_and_push feedlytics-widget ./feedlytics-widget \
  "VITE_FEEDLYTICS_API_BASE_URL=${VITE_FEEDLYTICS_API_BASE_URL:-https://api.feedlytics.in}"

echo "Done. Images pushed to Docker Hub as ${DOCKER_USERNAME}/feedlytics-*:${TAG}"
