# Biometric Device Management API Test Script (PowerShell)
# Tests all CRUD endpoints for biometric devices and PIN mappings

$BaseURL = "http://localhost:3002/api/v1"
$HospitalId = Read-Host "Enter Hospital ID (or press Enter to use default)"
if ([string]::IsNullOrWhiteSpace($HospitalId)) {
    Write-Host "Using default hospital ID from first login..." -ForegroundColor Yellow
    Write-Host "You'll need to login first and provide a valid JWT token" -ForegroundColor Yellow
    Write-Host ""
}

$Token = Read-Host "Enter JWT token (get from login response or browser DevTools)"

if ([string]::IsNullOrWhiteSpace($Token)) {
    Write-Host "ERROR: JWT token is required to test authenticated endpoints" -ForegroundColor Red
    Write-Host "Please login to http://localhost:5173 and copy the token from DevTools > Application > Local Storage > sb-*-auth-token" -ForegroundColor Yellow
    exit 1
}

$Headers = @{
    "Authorization" = "Bearer $Token"
    "Content-Type" = "application/json"
}

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Biometric Device API Test Suite" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# If no hospital ID provided, get from memberships
if ([string]::IsNullOrWhiteSpace($HospitalId)) {
    Write-Host "Fetching hospital ID from user memberships..." -ForegroundColor Yellow
    try {
        $memberships = Invoke-RestMethod -Uri "$BaseURL/hospitals" -Method GET -Headers $Headers
        $HospitalId = $memberships.data[0].id
        Write-Host "Using Hospital ID: $HospitalId" -ForegroundColor Green
    } catch {
        Write-Host "ERROR: Could not fetch hospital ID. Please provide it manually." -ForegroundColor Red
        exit 1
    }
    Write-Host ""
}

# Test 1: List devices (should be empty initially)
Write-Host "Test 1: List Biometric Devices" -ForegroundColor Yellow
Write-Host "---------------------------------------"
try {
    $response = Invoke-RestMethod -Uri "$BaseURL/hospitals/$HospitalId/biometric/devices" -Method GET -Headers $Headers
    Write-Host "Success! Found $($response.data.Count) devices" -ForegroundColor Green
    $response.data | Format-Table -AutoSize
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Create a new device
Write-Host "Test 2: Create New Biometric Device" -ForegroundColor Yellow
Write-Host "---------------------------------------"
$newDevice = @{
    serial_number = "DEVICE001"
    name = "Main Entrance Biometric"
    location = "Floor 1, Main Entrance"
    model = "ZKTeco K40"
    ip_address = "192.168.1.100"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BaseURL/hospitals/$HospitalId/biometric/devices" `
        -Method POST `
        -Headers $Headers `
        -Body $newDevice
    Write-Host "Success! Device created:" -ForegroundColor Green
    $DeviceId = $response.data.id
    Write-Host "Device ID: $DeviceId" -ForegroundColor Cyan
    $response.data | Format-List
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Gray
    }
}
Write-Host ""

# Test 3: Get single device
if ($DeviceId) {
    Write-Host "Test 3: Get Device Details" -ForegroundColor Yellow
    Write-Host "---------------------------------------"
    try {
        $response = Invoke-RestMethod -Uri "$BaseURL/hospitals/$HospitalId/biometric/devices/$DeviceId" `
            -Method GET `
            -Headers $Headers
        Write-Host "Success! Device details:" -ForegroundColor Green
        $response.data | Format-List
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 4: Update device
if ($DeviceId) {
    Write-Host "Test 4: Update Device" -ForegroundColor Yellow
    Write-Host "---------------------------------------"
    $updateData = @{
        location = "Floor 2, Reception"
        firmware_version = "v6.2.5"
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$BaseURL/hospitals/$HospitalId/biometric/devices/$DeviceId" `
            -Method PATCH `
            -Headers $Headers `
            -Body $updateData
        Write-Host "Success! Device updated:" -ForegroundColor Green
        $response.data | Format-List
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 5: Change device status
if ($DeviceId) {
    Write-Host "Test 5: Change Device Status to Maintenance" -ForegroundColor Yellow
    Write-Host "---------------------------------------"
    $statusData = @{
        status = "maintenance"
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$BaseURL/hospitals/$HospitalId/biometric/devices/$DeviceId/status" `
            -Method PATCH `
            -Headers $Headers `
            -Body $statusData
        Write-Host "Success! Status changed to: $($response.data.status)" -ForegroundColor Green
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""

    # Change back to active
    Write-Host "Test 5b: Change Device Status Back to Active" -ForegroundColor Yellow
    Write-Host "---------------------------------------"
    $statusData = @{
        status = "active"
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$BaseURL/hospitals/$HospitalId/biometric/devices/$DeviceId/status" `
            -Method PATCH `
            -Headers $Headers `
            -Body $statusData
        Write-Host "Success! Status changed to: $($response.data.status)" -ForegroundColor Green
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 6: Create PIN mapping
Write-Host "Test 6: Create PIN Mapping" -ForegroundColor Yellow
Write-Host "---------------------------------------"
Write-Host "NOTE: You need a valid user_id from your hospital staff" -ForegroundColor Gray
$UserId = Read-Host "Enter User ID to map (or press Enter to skip)"

if (-not [string]::IsNullOrWhiteSpace($UserId)) {
    $pinMapping = @{
        user_id = $UserId
        biometric_pin = "123"
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$BaseURL/hospitals/$HospitalId/biometric/pin-mappings" `
            -Method POST `
            -Headers $Headers `
            -Body $pinMapping
        Write-Host "Success! PIN mapping created:" -ForegroundColor Green
        $MappingId = $response.data.id
        $response.data | Format-List
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.ErrorDetails.Message) {
            Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "Skipped PIN mapping test" -ForegroundColor Gray
}
Write-Host ""

# Test 7: List PIN mappings
Write-Host "Test 7: List PIN Mappings" -ForegroundColor Yellow
Write-Host "---------------------------------------"
try {
    $response = Invoke-RestMethod -Uri "$BaseURL/hospitals/$HospitalId/biometric/pin-mappings" `
        -Method GET `
        -Headers $Headers
    Write-Host "Success! Found $($response.data.Count) PIN mappings" -ForegroundColor Green
    $response.data | Format-Table -AutoSize
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "API Test Suite Complete!" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Device ID: $DeviceId" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next: Test webhook with test-biometric-webhook.ps1" -ForegroundColor Green
