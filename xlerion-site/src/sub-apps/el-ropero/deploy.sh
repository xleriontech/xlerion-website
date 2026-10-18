#!/usr/bin/env bash
set -euo pipefail

echo "Building el-ropero deployable artifact..."
composer install --no-dev --optimize-autoloader
npm ci
npm run prod
php artisan config:cache
php artisan route:cache
ZIP_NAME="el-ropero-deploy.zip"
echo "Creating $ZIP_NAME (excluding node_modules, vendor, storage, .git)..."
zip -r "$ZIP_NAME" . -x "node_modules/*" "vendor/*" "storage/*" ".git/*"
echo "Done: $ZIP_NAME"
