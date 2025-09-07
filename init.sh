#!/bin/sh

echo "🚀 Starting backend initialization..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Run database migrations
echo "🔧 Running database migrations..."
npx prisma migrate dev --name init

# Start the application
echo "✅ Starting application..."
npx ts-node src/index.ts
