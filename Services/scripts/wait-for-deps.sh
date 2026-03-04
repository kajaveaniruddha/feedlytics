#!/bin/sh
# wait-for-neon.sh
set -e

if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL environment variable is not set."
  exit 1
fi

echo "Waiting for Neon database to be available..."

# We use `psql` with the full DATABASE_URL. The command `psql -c '\q'` simply
# tries to connect and immediately quits. It will return a non-zero exit
# code on failure, causing the loop to continue.
# `PGCONNECT_TIMEOUT` prevents it from hanging indefinitely on each attempt.
until PGCONNECT_TIMEOUT=10 psql "$DATABASE_URL" -c '\q' > /dev/null 2>&1; do
  >&2 echo "Neon is unavailable - sleeping for 2 seconds before retrying."
  sleep 2
done

>&2 echo "✅ Neon database is connected. Proceeding with command."

# Execute the command passed to this script (e.g., "pnpm run db:push")
exec "$@"