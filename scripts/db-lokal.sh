#!/usr/bin/env bash
# Lokale PostgreSQL-Datenbank für Entwicklung und Tests (ohne Docker).
# Voraussetzung: brew install postgresql@17
# Nutzung: scripts/db-lokal.sh start | stop | status
# Die Daten liegen in .data/postgres (nicht im Git). Port 54329, nur auf localhost.
set -euo pipefail
export LC_ALL="${LC_ALL:-en_US.UTF-8}"

BIN="${PG_BIN:-$(brew --prefix postgresql@17 2>/dev/null)/bin}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DATA="$ROOT/.data/postgres"
PORT=54329

befehl="${1:-status}"

case "$befehl" in
  start)
    if [ ! -d "$DATA" ]; then
      echo "→ Datenbank-Verzeichnis anlegen"
      mkdir -p "$DATA"
      "$BIN/initdb" -D "$DATA" -U lena --auth=trust --encoding=UTF8 --locale=en_US.UTF-8 >/dev/null
    fi
    if "$BIN/pg_ctl" -D "$DATA" status >/dev/null 2>&1; then
      echo "✓ läuft bereits (Port $PORT)"
    else
      "$BIN/pg_ctl" -D "$DATA" -o "-p $PORT -c listen_addresses=127.0.0.1" -l "$DATA/server.log" -w start >/dev/null
      echo "✓ gestartet (Port $PORT)"
    fi
    for db in lena_cms lena_cms_test; do
      "$BIN/psql" -h 127.0.0.1 -p $PORT -U lena -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$db'" | grep -q 1 \
        || "$BIN/createdb" -h 127.0.0.1 -p $PORT -U lena "$db"
    done
    echo "DATABASE_URL=postgres://lena@127.0.0.1:$PORT/lena_cms"
    echo "TEST_DATABASE_URL=postgres://lena@127.0.0.1:$PORT/lena_cms_test"
    ;;
  stop)
    "$BIN/pg_ctl" -D "$DATA" -m fast stop
    ;;
  status)
    "$BIN/pg_ctl" -D "$DATA" status || true
    ;;
  *)
    echo "Nutzung: $0 start|stop|status" >&2
    exit 2
    ;;
esac
