#!/bin/bash

# Preparation script for deploying to Render

echo "===== Preparing Damask Shop for deployment ====="

# Ensure the script is executable
chmod +x prepare-deployment.sh

# Step 1: Install dependencies
echo "Installing dependencies..."
npm install

# Step 2: Build the client
echo "Building the client..."
npm run build

# Step 3: Ensure directories exist
echo "Creating necessary directories..."
mkdir -p dist/static

# Step 4: Copy client build to static directory
echo "Copying client build to static directory..."
cp -R client/dist/* dist/static/

# Step 5: Check if database variables are set
if [ -z "$DATABASE_URL" ]; then
  echo "Warning: DATABASE_URL environment variable is not set"
  echo "Make sure to set it when deploying to Render"
fi

# Step 6: Check if session secret is set
if [ -z "$SESSION_SECRET" ]; then
  echo "Warning: SESSION_SECRET environment variable is not set"
  echo "Make sure to set it when deploying to Render"
fi

# Step 7: Final message
echo "===== Deployment preparation complete ====="
echo "You can now deploy to Render using the following:"
echo "Build command: npm install && npm run build"
echo "Start command: npm start"
echo ""
echo "Don't forget to set the required environment variables in Render:"
echo "- DATABASE_URL"
echo "- SESSION_SECRET"
echo "- NODE_ENV=production"