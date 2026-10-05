# PowerShell script to apply seed data migration to Supabase
# Reads .env file and executes the SQL migration

Write-Host "Reading environment variables..." -ForegroundColor Cyan

# Read .env file
$envFile = Get-Content ".env" -Raw
$envVars = @{}
$envFile -split "`n" | ForEach-Object {
    if ($_ -match "^\s*([^#][^=]+)=(.+)$") {
        $envVars[$matches[1].Trim()] = $matches[2].Trim()
    }
}

$SUPABASE_URL = $envVars["SUPABASE_URL"]
$SUPABASE_SERVICE_ROLE_KEY = $envVars["SUPABASE_SERVICE_ROLE_KEY"]

if (-not $SUPABASE_URL -or -not $SUPABASE_SERVICE_ROLE_KEY) {
    Write-Host "ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env file" -ForegroundColor Red
    exit 1
}

# Extract project ref from URL
$projectRef = ($SUPABASE_URL -replace "https://", "" -replace ".supabase.co", "")
Write-Host "Project Reference: $projectRef" -ForegroundColor Yellow

# Read SQL migration file
Write-Host "Reading migration file..." -ForegroundColor Cyan
$sqlContent = Get-Content "migrations\0034_seed_comprehensive_demo_data.sql" -Raw

# Prepare API request to execute SQL
$headers = @{
    "Authorization" = "Bearer $SUPABASE_SERVICE_ROLE_KEY"
    "Content-Type" = "application/json"
    "apikey" = $SUPABASE_SERVICE_ROLE_KEY
}

$body = @{
    query = $sqlContent
} | ConvertTo-Json -Depth 10

Write-Host "Executing SQL migration..." -ForegroundColor Cyan
Write-Host "This may take a few moments..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/rpc/exec_sql" -Method Post -Headers $headers -Body $body -ErrorAction Stop
    Write-Host "✓ Migration applied successfully!" -ForegroundColor Green
    Write-Host "Comprehensive demo data has been seeded to the database." -ForegroundColor Green
} catch {
    # Try alternative approach using PostgREST
    Write-Host "Trying alternative method..." -ForegroundColor Yellow
    
    # Split SQL into individual statements and execute
    $statements = $sqlContent -split ";"
    $successCount = 0
    $errorCount = 0
    
    foreach ($statement in $statements) {
        $trimmed = $statement.Trim()
        if ($trimmed -and $trimmed -notmatch "^--") {
            try {
                $stmtBody = @{ query = $trimmed + ";" } | ConvertTo-Json
                Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/rpc/exec_sql" -Method Post -Headers $headers -Body $stmtBody -ErrorAction Stop | Out-Null
                $successCount++
            } catch {
                $errorCount++
                if ($errorCount -lt 5) {
                    Write-Host "  Error in statement: $($trimmed.Substring(0, [Math]::Min(50, $trimmed.Length)))..." -ForegroundColor Red
                }
            }
        }
    }
    
    Write-Host "`nMigration completed with:" -ForegroundColor Cyan
    Write-Host "  ✓ Successful statements: $successCount" -ForegroundColor Green
    if ($errorCount -gt 0) {
        Write-Host "  ✗ Failed statements: $errorCount" -ForegroundColor Yellow
        Write-Host "`nNote: Some errors may be expected (e.g., if data already exists)" -ForegroundColor Gray
    }
}

Write-Host "`nYou can now test the application with the seeded data!" -ForegroundColor Cyan
