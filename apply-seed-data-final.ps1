# Apply seed data to Supabase ylalzjsjmphevzxiyyqa
Write-Host "🌱 Applying seed data to Supabase..." -ForegroundColor Cyan

# Read the SQL file
$sqlPath = "C:\Users\mithu\AppData\Local\Temp\migration.sql"
$sql = [System.IO.File]::ReadAllText($sqlPath, [System.Text.Encoding]::UTF8)

Write-Host "✅ Loaded SQL file: $($sql.Length) characters" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Please follow these steps to apply the migration:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Open your browser and go to: https://supabase.com/dashboard/project/ylalzjsjmphevzxiyyqa/sql/new" -ForegroundColor White
Write-Host ""
Write-Host "2. Copy the SQL file content from: $sqlPath" -ForegroundColor White
Write-Host ""
Write-Host "3. Paste it into the Supabase SQL Editor" -ForegroundColor White
Write-Host ""
Write-Host "4. Click 'Run' to execute the migration" -ForegroundColor White
Write-Host ""
Write-Host "✨ This will populate your database with comprehensive demo data!" -ForegroundColor Green
Write-Host ""

# Open browser automatically
Start-Process "https://supabase.com/dashboard/project/ylalzjsjmphevzxiyyqa/sql/new"

# Copy SQL to clipboard
$sql | Set-Clipboard
Write-Host "✅ SQL has been copied to your clipboard!" -ForegroundColor Green
Write-Host "   Just paste it (Ctrl+V) into the Supabase SQL Editor" -ForegroundColor Gray
