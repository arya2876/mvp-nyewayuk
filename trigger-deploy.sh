#!/bin/bash

# Script untuk trigger redeploy Vercel
# Menambahkan timestamp untuk force rebuild

TIMESTAMP=$(date +%s)
echo "Triggering Vercel redeploy at: $TIMESTAMP"

# Update README dengan timestamp untuk trigger deploy
cat >> README.md << EOF

<!-- Deploy trigger: $TIMESTAMP -->
EOF

git add README.md
git commit -m "Trigger Vercel redeploy - $TIMESTAMP"
git push origin main

echo "✅ Push completed! Vercel akan auto-deploy dalam beberapa menit."
echo "🌐 Check status di: https://vercel.com/arya2876/mvp-nyewayuk"
