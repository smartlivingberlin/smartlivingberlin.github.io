#!/bin/bash
set -e
STAMP=$(date +'%Y%m%d-%H%M%S')
git add -A
git commit -m "Auto: Inhalte & Assets aktualisiert ${STAMP}" || true
git push origin main
echo "✅ Online: https://smartlivingberlin.github.io/"
