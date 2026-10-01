# Biometric Webhook Test Script - ZKTeco ADMS Protocol (PowerShell)
# This script simulates attendance records being pushed from a ZKTeco device

$BaseURL = "http://localhost:3002"

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "ZKTeco Biometric Webhook Test Suite" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check-In event (Status 0)
Write-Host "Test 1: Simulating Check-In (Status=0)" -ForegroundColor Yellow
Write-Host "---------------------------------------"
$body = "123`t2026-09-29 09:00:00`t0`t1`t0"
try {
    $response = Invoke-WebRequest -Uri "$BaseURL/biometric/webhook?SN=DEVICE001&table=ATTLOG" `
        -Method POST `
        -ContentType "text/plain" `
        -Body $body
    Write-Host "HTTP Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "HTTP Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Check-Out event (Status 1)
Write-Host "Test 2: Simulating Check-Out (Status=1)" -ForegroundColor Yellow
Write-Host "---------------------------------------"
$body = "123`t2026-09-29 17:30:00`t1`t1`t0"
try {
    $response = Invoke-WebRequest -Uri "$BaseURL/biometric/webhook?SN=DEVICE001&table=ATTLOG" `
        -Method POST `
        -ContentType "text/plain" `
        -Body $body
    Write-Host "HTTP Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "HTTP Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Break Out (Status 2)
Write-Host "Test 3: Simulating Break Out (Status=2)" -ForegroundColor Yellow
Write-Host "---------------------------------------"
$body = "123`t2026-09-29 12:00:00`t2`t1`t0"
try {
    $response = Invoke-WebRequest -Uri "$BaseURL/biometric/webhook?SN=DEVICE001&table=ATTLOG" `
        -Method POST `
        -ContentType "text/plain" `
        -Body $body
    Write-Host "HTTP Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "HTTP Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Face recognition verification
Write-Host "Test 4: Face Recognition Check-In (VerifyMode=15)" -ForegroundColor Yellow
Write-Host "---------------------------------------"
$body = "456`t2026-09-29 09:15:00`t0`t15`t0"
try {
    $response = Invoke-WebRequest -Uri "$BaseURL/biometric/webhook?SN=DEVICE001&table=ATTLOG" `
        -Method POST `
        -ContentType "text/plain" `
        -Body $body
    Write-Host "HTTP Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "HTTP Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: Invalid device serial
Write-Host "Test 5: Invalid Device Serial (Expected: 404)" -ForegroundColor Yellow
Write-Host "---------------------------------------"
$body = "123`t2026-09-29 09:00:00`t0`t1`t0"
try {
    $response = Invoke-WebRequest -Uri "$BaseURL/biometric/webhook?SN=INVALID_DEVICE&table=ATTLOG" `
        -Method POST `
        -ContentType "text/plain" `
        -Body $body `
        -ErrorAction Stop
    Write-Host "HTTP Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "HTTP Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Magenta
    Write-Host "Error (expected): $($_.Exception.Message)" -ForegroundColor Gray
}
Write-Host ""

# Test 6: Batch upload
Write-Host "Test 6: Batch Upload (3 records)" -ForegroundColor Yellow
Write-Host "---------------------------------------"
$body = @"
123	2026-09-30 09:00:00	0	1	0
456	2026-09-30 09:05:00	0	1	0
789	2026-09-30 09:10:00	0	1	0
"@
try {
    $response = Invoke-WebRequest -Uri "$BaseURL/biometric/webhook?SN=DEVICE001&table=ATTLOG" `
        -Method POST `
        -ContentType "text/plain" `
        -Body $body
    Write-Host "HTTP Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "HTTP Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Test Suite Complete!" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Green
Write-Host "1. Register DEVICE001 via UI: http://localhost:5173/biometric-devices"
Write-Host "2. Create PIN mappings: 123 -> Staff User 1, 456 -> Staff User 2, 789 -> Staff User 3"
Write-Host "3. Re-run this script to see actual attendance records created"
Write-Host "4. Check attendance page: http://localhost:5173/attendance"
Write-Host ""
