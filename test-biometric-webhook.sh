#!/bin/bash
# Biometric Webhook Test Script - ZKTeco ADMS Protocol
# This script simulates attendance records being pushed from a ZKTeco device

BASE_URL="http://localhost:3002"

echo "==================================="
echo "ZKTeco Biometric Webhook Test Suite"
echo "==================================="
echo ""

# Test 1: Check-In event (Status 0)
echo "Test 1: Simulating Check-In (Status=0)"
echo "---------------------------------------"
curl -X POST "${BASE_URL}/biometric/webhook?SN=DEVICE001&table=ATTLOG" \
  -H "Content-Type: text/plain" \
  -d "123	2026-09-29 09:00:00	0	1	0" \
  -w "\nHTTP Status: %{http_code}\n" \
  -v
echo ""
echo ""

# Test 2: Check-Out event (Status 1)
echo "Test 2: Simulating Check-Out (Status=1)"
echo "---------------------------------------"
curl -X POST "${BASE_URL}/biometric/webhook?SN=DEVICE001&table=ATTLOG" \
  -H "Content-Type: text/plain" \
  -d "123	2026-09-29 17:30:00	1	1	0" \
  -w "\nHTTP Status: %{http_code}\n"
echo ""
echo ""

# Test 3: Break Out (Status 2)
echo "Test 3: Simulating Break Out (Status=2)"
echo "---------------------------------------"
curl -X POST "${BASE_URL}/biometric/webhook?SN=DEVICE001&table=ATTLOG" \
  -H "Content-Type: text/plain" \
  -d "123	2026-09-29 12:00:00	2	1	0" \
  -w "\nHTTP Status: %{http_code}\n"
echo ""
echo ""

# Test 4: Break In (Status 3)
echo "Test 4: Simulating Break In (Status=3)"
echo "---------------------------------------"
curl -X POST "${BASE_URL}/biometric/webhook?SN=DEVICE001&table=ATTLOG" \
  -H "Content-Type: text/plain" \
  -d "123	2026-09-29 12:30:00	3	1	0" \
  -w "\nHTTP Status: %{http_code}\n"
echo ""
echo ""

# Test 5: Overtime In (Status 4)
echo "Test 5: Simulating Overtime In (Status=4)"
echo "---------------------------------------"
curl -X POST "${BASE_URL}/biometric/webhook?SN=DEVICE001&table=ATTLOG" \
  -H "Content-Type: text/plain" \
  -d "123	2026-09-29 18:00:00	4	1	0" \
  -w "\nHTTP Status: %{http_code}\n"
echo ""
echo ""

# Test 6: Face recognition verification (VerifyMode=15)
echo "Test 6: Face Recognition Check-In (VerifyMode=15)"
echo "---------------------------------------"
curl -X POST "${BASE_URL}/biometric/webhook?SN=DEVICE001&table=ATTLOG" \
  -H "Content-Type: text/plain" \
  -d "456	2026-09-29 09:15:00	0	15	0" \
  -w "\nHTTP Status: %{http_code}\n"
echo ""
echo ""

# Test 7: Card verification (VerifyMode=2)
echo "Test 7: Card Swipe Check-In (VerifyMode=2)"
echo "---------------------------------------"
curl -X POST "${BASE_URL}/biometric/webhook?SN=DEVICE001&table=ATTLOG" \
  -H "Content-Type: text/plain" \
  -d "789	2026-09-29 09:20:00	0	2	0" \
  -w "\nHTTP Status: %{http_code}\n"
echo ""
echo ""

# Test 8: Invalid device serial (should fail gracefully)
echo "Test 8: Invalid Device Serial (Expected: 404)"
echo "---------------------------------------"
curl -X POST "${BASE_URL}/biometric/webhook?SN=INVALID_DEVICE&table=ATTLOG" \
  -H "Content-Type: text/plain" \
  -d "123	2026-09-29 09:00:00	0	1	0" \
  -w "\nHTTP Status: %{http_code}\n"
echo ""
echo ""

# Test 9: Malformed data (missing fields)
echo "Test 9: Malformed Data (Expected: 400)"
echo "---------------------------------------"
curl -X POST "${BASE_URL}/biometric/webhook?SN=DEVICE001&table=ATTLOG" \
  -H "Content-Type: text/plain" \
  -d "123	2026-09-29" \
  -w "\nHTTP Status: %{http_code}\n"
echo ""
echo ""

# Test 10: Multiple records in batch (tab-separated)
echo "Test 10: Batch Upload (3 records)"
echo "---------------------------------------"
curl -X POST "${BASE_URL}/biometric/webhook?SN=DEVICE001&table=ATTLOG" \
  -H "Content-Type: text/plain" \
  -d "123	2026-09-30 09:00:00	0	1	0
456	2026-09-30 09:05:00	0	1	0
789	2026-09-30 09:10:00	0	1	0" \
  -w "\nHTTP Status: %{http_code}\n"
echo ""
echo ""

echo "==================================="
echo "Test Suite Complete!"
echo "==================================="
echo ""
echo "Next Steps:"
echo "1. Register DEVICE001 via UI: http://localhost:5173/biometric-devices"
echo "2. Create PIN mappings: 123 → Staff User 1, 456 → Staff User 2, 789 → Staff User 3"
echo "3. Re-run this script to see actual attendance records created"
echo "4. Check attendance page: http://localhost:5173/attendance"
echo ""
