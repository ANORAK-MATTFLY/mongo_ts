# Use Bun's official image
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json bun.lockb ./

# Install dependencies using Bun
RUN bun install --frozen-lockfile

# Copy the rest of the project
COPY . .

ENV NODE_ENV=development

# Expose the Next.js port
EXPOSE 3000

# Start Next.js in development mode
CMD ["bun", "dev"]

