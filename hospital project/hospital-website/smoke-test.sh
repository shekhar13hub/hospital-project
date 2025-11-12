#!/usr/bin/env bash
# Simple smoke test for API + demo flows. Uses REACT_APP_API_URL from .env or default.
API_URL=${REACT_APP_API_URL:-http://localhost:5000}
echo "API URL: $API_URL"

set -e

echo "Health check:"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/api/health" || echo "000")
echo " /api/health -> $HTTP_CODE"

DEMO_PHONE=9999999999
echo "Requesting OTP for $DEMO_PHONE"
SEND_RESP=$(curl -s -X POST "$API_URL/api/auth/send-otp" -H "Content-Type: application/json" -d '{"phone":"'$DEMO_PHONE'"}')
echo "send-otp response: $SEND_RESP"

# Extract dev_otp if present
DEV_OTP=$(echo "$SEND_RESP" | sed -n 's/.*"dev_otp"[: ]*"\([0-9]*\)".*/\1/p')
if [ -z "$DEV_OTP" ]; then
  echo "No dev_otp received; using 123456 for demo"
  DEV_OTP=123456
fi

echo "Verifying OTP $DEV_OTP"
VERIFY_RESP=$(curl -s -X POST "$API_URL/api/auth/verify-otp" -H "Content-Type: application/json" -d '{"phone":"'$DEMO_PHONE'","otp":"'$DEV_OTP'"}')
echo "verify-otp response: $VERIFY_RESP"

# Try listing hospitals
echo "Listing hospitals"
HOSPS=$(curl -s "$API_URL/api/hospitals")
echo "$HOSPS" | jq -C '.' || echo "$HOSPS"

echo "Smoke test complete"
