#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# 单位换算器 — 自测脚本 (iteration 0.0.1)
# ============================================================

PASS=0
FAIL=0
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

pass() { echo -e "${GREEN}[PASS]${NC} $1"; PASS=$((PASS + 1)); }
fail() { echo -e "${RED}[FAIL]${NC} $1"; FAIL=$((FAIL + 1)); }

echo "============================================"
echo "  单位换算器 自测 — iteration 0.0.1"
echo "============================================"
echo ""

# ---- Phase 1: Unit Tests ----
echo "--- Phase 1: Unit Tests (vitest) ---"
if npx vitest run --reporter=verbose 2>&1; then
  pass "All unit tests passed"
else
  fail "Unit tests failed"
fi
echo ""

# ---- Phase 2: Build Output Checks ----
echo "--- Phase 2: Build Output Verification ---"
rm -rf dist
npx vite build 2>&1

# Check basePath prefix in built HTML
if grep -q 'src="/projects/unit-converter/' dist/index.html; then
  pass "basePath /projects/unit-converter/ in HTML script src"
else
  fail "Missing basePath in HTML script src"
fi

if grep -q 'href="/projects/unit-converter/' dist/index.html; then
  pass "basePath /projects/unit-converter/ in HTML link href"
else
  fail "Missing basePath in HTML link href"
fi

# Check version token
if grep -q '?v=0.0.1' dist/index.html; then
  pass "Version token ?v=0.0.1 present in built HTML"
else
  fail "Missing version token ?v=0.0.1 in built HTML"
fi

# Check that both assets have the version token
JS_COUNT=$(grep -c '\.js?v=0.0.1' dist/index.html || true)
CSS_COUNT=$(grep -c '\.css?v=0.0.1' dist/index.html || true)
if [ "$JS_COUNT" -ge 1 ]; then
  pass "JS asset has version token"
else
  fail "JS asset missing version token"
fi
if [ "$CSS_COUNT" -ge 1 ]; then
  pass "CSS asset has version token"
else
  fail "CSS asset missing version token"
fi

# Verify dist/assets/ exists and has files
if ls dist/assets/*.js >/dev/null 2>&1; then
  pass "JS bundle generated in dist/assets/"
else
  fail "No JS bundle in dist/assets/"
fi
if ls dist/assets/*.css >/dev/null 2>&1; then
  pass "CSS bundle generated in dist/assets/"
else
  fail "No CSS bundle in dist/assets/"
fi
echo ""

# ---- Phase 3: Cache-Control Header Check ----
echo "--- Phase 3: Cache-Control Header Verification ---"
# Start preview server in background
npx vite preview --port 14173 &
PREVIEW_PID=$!
sleep 2

# Check Cache-Control header
HEADERS=$(curl -sI http://localhost:14173/projects/unit-converter/ 2>&1 || true)
if echo "$HEADERS" | grep -q "Cache-Control: no-cache"; then
  pass "Cache-Control: no-cache header present"
else
  fail "Cache-Control: no-cache header missing"
  echo "  Received headers:"
  echo "$HEADERS" | head -10
fi

# Check content type is HTML
if echo "$HEADERS" | grep -qi "Content-Type: text/html"; then
  pass "Content-Type is text/html"
else
  fail "Wrong Content-Type"
fi

# Kill preview server
kill $PREVIEW_PID 2>/dev/null || true
echo ""

# ---- Phase 4: TypeScript Compilation Check ----
echo "--- Phase 4: TypeScript Compilation ---"
if npx tsc -b 2>&1; then
  pass "TypeScript compilation clean"
else
  fail "TypeScript compilation has errors"
fi
echo ""

# ---- Summary ----
echo "============================================"
TOTAL=$((PASS + FAIL))
echo "  Results: ${GREEN}${PASS} passed${NC}, ${RED}${FAIL} failed${NC} (${TOTAL} total)"
echo "============================================"

if [ "$FAIL" -gt 0 ]; then
  echo -e "${RED}Self-test FAILED${NC}"
  exit 1
else
  echo -e "${GREEN}Self-test PASSED${NC}"
  exit 0
fi
