#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

get_python_cmd() {
  if command -v python3 >/dev/null 2>&1; then
    echo "python3"
    return
  fi

  if command -v python >/dev/null 2>&1; then
    echo "python"
    return
  fi

  if command -v py >/dev/null 2>&1; then
    echo "py -3"
    return
  fi

  echo ""
}

PYTHON_CMD="$(get_python_cmd)"
if [[ -z "${PYTHON_CMD}" ]]; then
  echo "No Python interpreter found. Install Python 3 and retry."
  exit 1
fi

PIDS=()

start_service() {
  local name="$1"
  local service_dir="$2"
  local cmd="$3"

  (
    cd "${ROOT_DIR}/${service_dir}"
    echo "[$name] starting in ${service_dir}"
    eval "${cmd}"
  ) &

  local pid=$!
  PIDS+=("${pid}")
  echo "[$name] pid=${pid}"
}

cleanup() {
  echo ""
  echo "Stopping all services..."
  for pid in "${PIDS[@]:-}"; do
    if kill -0 "${pid}" >/dev/null 2>&1; then
      kill "${pid}" >/dev/null 2>&1 || true
    fi
  done
  wait || true
}

trap cleanup INT TERM EXIT

start_service "backend-users" "backend-users/backend-users" "dotnet run"
start_service "backend-core" "backend-core" "node server.js"
start_service "ai-services" "ai-services" "${PYTHON_CMD} app.py"
start_service "frontend" "frontend" "npm start"

echo ""
echo "All services launched. Press Ctrl+C to stop everything."

wait
