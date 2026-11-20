#!/usr/bin/env bash
set -euo pipefail

MYSQL_BASE="${MYSQL_BASE:-/Users/Shared/DBngin/mysql/8.0.33}"
DATA_DIR="${VITANA_MYSQL_DATA:-$HOME/VitanaResidenceMySQL}"
PORT="${VITANA_MYSQL_PORT:-3308}"
SOCKET="${VITANA_MYSQL_SOCKET:-/tmp/vitana-mysql.sock}"
PID_FILE="/tmp/vitana-mysql.pid"
LOG_FILE="/tmp/vitana-mysql.err"
DB_NAME="${VITANA_DB_NAME:-vitana_residence}"
DB_USER="${VITANA_DB_USER:-vitana_user}"
DB_PASS="${VITANA_DB_PASSWORD:-vitana_pass}"

if [ ! -x "$MYSQL_BASE/bin/mysqld" ]; then
  echo "MySQL server tidak ditemukan di $MYSQL_BASE/bin/mysqld"
  echo "Atur MYSQL_BASE ke folder instalasi MySQL 8.0 Anda."
  exit 1
fi

if [ ! -d "$DATA_DIR/mysql" ]; then
  echo "Menyiapkan data directory MySQL di $DATA_DIR"
  mkdir -p "$DATA_DIR"
  "$MYSQL_BASE/bin/mysqld" \
    --no-defaults \
    --initialize-insecure \
    --basedir="$MYSQL_BASE" \
    --datadir="$DATA_DIR" \
    --log-error="$LOG_FILE"
  sleep 2
fi

if mysqladmin --protocol=tcp -h127.0.0.1 -P"$PORT" -uroot --skip-password ping >/dev/null 2>&1; then
  echo "MySQL sudah berjalan di 127.0.0.1:$PORT"
else
  echo "Menjalankan MySQL di 127.0.0.1:$PORT"
  nohup "$MYSQL_BASE/bin/mysqld" \
    --no-defaults \
    --basedir="$MYSQL_BASE" \
    --datadir="$DATA_DIR" \
    --port="$PORT" \
    --socket="$SOCKET" \
    --bind-address=127.0.0.1 \
    --pid-file="$PID_FILE" \
    --log-error="$LOG_FILE" \
    --mysqlx=0 \
    > /tmp/vitana-mysql.out 2>&1 &

  for _ in $(seq 1 30); do
    if mysqladmin --protocol=tcp -h127.0.0.1 -P"$PORT" -uroot --skip-password ping >/dev/null 2>&1; then
      break
    fi
    sleep 1
  done
fi

mysql --protocol=tcp -h127.0.0.1 -P"$PORT" -uroot --skip-password <<SQL
CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'127.0.0.1' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON \`$DB_NAME\`.* TO '$DB_USER'@'127.0.0.1';
FLUSH PRIVILEGES;
SQL

echo "MySQL siap. Database: $DB_NAME, user: $DB_USER, port: $PORT"
