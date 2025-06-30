#!/bin/bash
set -e

PROJECT_DIR="/Users/chester/Repo/ashevilleventpage"

echo "Navigating to project directory..."
cd "$PROJECT_DIR"

echo "Checking if vercel.json exists..."
if [[ ! -f vercel.json ]]; then
    echo "Creating vercel.json..."
    cat > vercel.json << 'EOF'
{
  "buildCommand": "vite build",
  "outputDirectory": "dist/public",
  "framework": null,
  "installCommand": "npm install"
}
EOF
fi

echo "Linking to existing Vercel project..."
echo "Run this command to reconnect to your existing project:"
echo "  vercel link"
echo ""
echo "Then you can deploy with:"
echo "  vercel --prod"
echo ""
echo "If you want to start fresh, run:"
echo "  vercel"
echo ""
echo "Done."