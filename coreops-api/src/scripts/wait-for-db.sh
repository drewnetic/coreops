echo "⏳ Waiting for Postgres at $DATABASE_URL..."

until nc -z postgres 5432; do
  sleep 1
done

echo "✅ Postgres is available"