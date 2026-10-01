# Apply migration 0025 to Supabase database
$ErrorActionPreference = "Stop"

# Load environment variables
Get-Content "f:\mithun-dominic\Projects\hospital-management-system\backend\.env" | ForEach-Object {
    if ($_ -match '^SUPABASE_URL=(.+)$') {
        $env:SUPABASE_URL = $matches[1]
    }
    if ($_ -match '^SUPABASE_SERVICE_ROLE_KEY=(.+)$') {
        $env:SUPABASE_SERVICE_ROLE_KEY = $matches[1]
    }
}

# Read migration SQL
$migrationSQL = Get-Content "f:\mithun-dominic\Projects\hospital-management-system\backend\migrations\0025_patient_portal_foundation.sql" -Raw

# Extract project ref from URL
$projectRef = $env:SUPABASE_URL -replace 'https://([^.]+)\.supabase\.co', '$1'

Write-Host "Applying migration 0025 to Supabase project: $projectRef" -ForegroundColor Cyan

# Use Supabase REST API to execute SQL
$headers = @{
    "apikey" = $env:SUPABASE_SERVICE_ROLE_KEY
    "Authorization" = "Bearer $env:SUPABASE_SERVICE_ROLE_KEY"
    "Content-Type" = "application/json"
}

$body = @{
    query = $migrationSQL
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$($env:SUPABASE_URL)/rest/v1/rpc/exec" -Method Post -Headers $headers -Body $body
    Write-Host "✅ Migration 0025 applied successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Error applying migration:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Please apply the migration manually via Supabase Dashboard SQL Editor:" -ForegroundColor Yellow
    Write-Host "https://supabase.com/dashboard/project/$projectRef/sql" -ForegroundColor Yellow
    exit 1
}
