FROM node:18-alpine

# Install required packages for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Make init script executable
RUN chmod +x init.sh

# Expose port
EXPOSE 3001

# Start the application with init script
CMD ["./init.sh"]
