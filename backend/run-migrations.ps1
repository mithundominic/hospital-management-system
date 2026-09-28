# Run all SQL migrations
$ErrorActionPreference = "Stop"

# Read .env file
$envFile = Get-Content .env
$env:SUPABASE_URL = ($envFile | Select-String "SUPABASE_URL=(.+)").Matches.Groups[1].Value
$env:SUPABASE_SECRET_KEY = ($envFile | Select-String "SUPABASE_SECRET_KEY=(.+)").Matches.Groups[1].Value

Write-Host "Running migrations..." -ForegroundColor Cyan

# Get all migration files sorted
$migrations = Get-ChildItem migrations\*.sql | Sort-Object Name

foreach ($migration in $migrations) {
    Write-Host "`n📄 Running: $($migration.Name)" -ForegroundColor Yellow
    
    $sql = Get-Content $migration.FullName -Raw
    
    $headers = @{
        'apikey' = $env:SUPABASE_SECRET_KEY
        'Authorization' = "Bearer $($env:SUPABASE_SECRET_KEY)"
        'Content-Type' = 'application/json'
        'Prefer' = 'return=minimal'
    }
    
    $body = @{
        query = $sql
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod `
            -Uri "$($env:SUPABASE_URL)/rest/v1/rpc/exec_sql" `
            -Method Post `
            -Headers $headers `
            -Body $body `
            -ErrorAction Stop
        
        Write-Host "   ✓ Success" -ForegroundColor Green
    } catch {
        # Try direct SQL endpoint
        try {
            $response = Invoke-WebRequest `
                -Uri "$($env:SUPABASE_URL)/sql" `
                -Method Post `
                -Headers $headers `
                -Body $sql `
                -ContentType "application/sql" `
                -ErrorAction Stop
            
            Write-Host "   ✓ Success" -ForegroundColor Green
        } catch {
            Write-Host "   ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host "   Trying via Node.js..." -ForegroundColor Yellow
            
            # Fall back to Node.js execution
            $jsCode = @"
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient('$($env:SUPABASE_URL)', '$($env:SUPABASE_SECRET_KEY)');
const sql = fs.readFileSync('$($migration.FullName)', 'utf8');

(async () => {
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
  console.log('Success');
})();
"@
            $jsCode | Out-File -FilePath temp-migration.js -Encoding utf8
            node temp-migration.js
            Remove-Item temp-migration.js
        }
    }
}

Write-Host "`n✅ All migrations completed!" -ForegroundColor Green
