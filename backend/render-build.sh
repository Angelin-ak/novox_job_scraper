#!/usr/bin/env bash
# exit on error
set -o errexit

# Update dependencies
pip install -r requirements.txt

# --- Install Google Chrome for Render ---
# We use chrome_v2 to completely bypass any broken cache from previous deployments
STORAGE_DIR=/opt/render/project/.render

if [[ ! -d $STORAGE_DIR/chrome_v2 ]]; then
  echo "...Downloading Google Chrome for Testing..."
  mkdir -p $STORAGE_DIR/chrome_v2
  cd $STORAGE_DIR/chrome_v2
  # Download Chrome for Testing zip
  wget -q https://storage.googleapis.com/chrome-for-testing-public/122.0.6261.128/linux64/chrome-linux64.zip
  echo "...Extracting Chrome..."
  unzip -q chrome-linux64.zip
  rm chrome-linux64.zip
  echo "...Google Chrome setup complete!"
else
  echo "...Using Google Chrome from Render cache."
fi
