# Script to remove @CrossOrigin annotations from all Java controllers

$services = @(
    "deal-service",
    "user-service",
    "notification-service"
)

forEach ($service in $services) {
    $controllerPath = ".\$service\src\main\java\com\tunistudent\controller"
    
    if (Test-Path $controllerPath) {
        Write-Host "Processing $service..." -ForegroundColor Green
        
        Get-ChildItem -Path $controllerPath -Filter "*.java" | ForEach-Object {
            $file = $_.FullName
$content = Get-Content $file -Raw
            
            # Remove @CrossOrigin annotation line
            $newContent = $content -replace '@CrossOrigin\(origins\s*=\s*"\*"\)\r?\n', ''
            
            if ($content -ne $newContent) {
                Set-Content -Path $file -Value $newContent -NoNewline
                Write-Host "  Updated: $($_.Name)" -ForegroundColor Yellow
            }
        }
    }
}

Write-Host "Done!" -ForegroundColor Green
