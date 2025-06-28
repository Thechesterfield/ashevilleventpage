#!/bin/bash
set -e

# Variables
PROJECT_DIR="/Users/chester/Repo/ashevilleventpage"
ZIP_PATH="$HOME/Downloads/AshevilleEventPulse (2).zip"
RENAMED_ZIP="$HOME/Downloads/ashevilleventpage.zip"
TEMP_DIR="/tmp/ashevilleventpage-temp"
BACKUP_DIR="/tmp/deployment-backup"

echo "Creating backup of deployment files..."
mkdir -p "$BACKUP_DIR"
cd "$PROJECT_DIR"

# Backup critical deployment files
cp -r .git "$BACKUP_DIR/" 2>/dev/null || echo "No .git directory found"
cp -r .vercel "$BACKUP_DIR/" 2>/dev/null || echo "No .vercel directory found"
cp vercel.json "$BACKUP_DIR/" 2>/dev/null || echo "No vercel.json found"
cp package.json "$BACKUP_DIR/" 2>/dev/null || echo "No package.json found"
cp package-lock.json "$BACKUP_DIR/" 2>/dev/null || echo "No package-lock.json found"

echo "Pulling latest changes from remote..."
git pull origin main 2>/dev/null || echo "Could not pull from remote"

echo "Cleaning project directory (preserving deployment files)..."
# Remove everything except deployment files
find . -maxdepth 1 -not -name "." -not -name ".git" -not -name ".vercel" -not -name "vercel.json" -exec rm -rf {} +

echo "Renaming downloaded ZIP..."
mv "$ZIP_PATH" "$RENAMED_ZIP"

echo "Unzipping new content..."
unzip -q "$RENAMED_ZIP" -d "$TEMP_DIR"

echo "Moving new files (excluding deployment files)..."
# Move everything except deployment files that would conflict
cd "$TEMP_DIR"/AshevilleEventPulse
for item in *; do
    if [[ "$item" != ".git" && "$item" != ".vercel" && "$item" != "vercel.json" ]]; then
        mv "$item" "$PROJECT_DIR"/
    fi
done

# Handle dotfiles carefully
for item in .*; do
    if [[ "$item" != "." && "$item" != ".." && "$item" != ".git" && "$item" != ".vercel" ]]; then
        mv "$item" "$PROJECT_DIR"/ 2>/dev/null || true
    fi
done

echo "Restoring deployment configuration..."
cd "$PROJECT_DIR"
# Restore deployment files if they were accidentally overwritten
if [[ ! -d .git && -d "$BACKUP_DIR/.git" ]]; then
    cp -r "$BACKUP_DIR/.git" .
fi
if [[ ! -d .vercel && -d "$BACKUP_DIR/.vercel" ]]; then
    cp -r "$BACKUP_DIR/.vercel" .
fi
if [[ ! -f vercel.json && -f "$BACKUP_DIR/vercel.json" ]]; then
    cp "$BACKUP_DIR/vercel.json" .
fi

echo "Installing dependencies..."
npm install

echo "Building project..."
npm run build

echo "Cleaning up temp files..."
rm -rf "$TEMP_DIR" "$RENAMED_ZIP" "$BACKUP_DIR"

echo "Deployment ready! You can now run:"
echo "  vercel --prod"
echo "Or commit and push changes:"
echo "  git add ."
echo "  git commit -m 'Update from Replit'"
echo "  git push"

echo "Done."