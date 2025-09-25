#!/bin/bash
set -e
msg="${*:-Quick deploy}"
git add -A
git commit -m "$msg" || echo "ℹ️ Nichts zu committen"
git push origin main
echo "✅ Online: https://smartlivingberlin.github.io/"
