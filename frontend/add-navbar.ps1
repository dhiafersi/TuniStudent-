# PowerShell script to add navbar imports to component files

$componentsToUpdate = @(
    "src/app/pages/favorites/favorites.component.ts",
    "src/app/pages/profile/profile.component.ts",
    "src/app/pages/deal/deal-detail.component.ts",
    "src/app/pages/deal/submit-deal.component.ts",
    "src/app/pages/admin/admin-dashboard.component.ts"
)

$importLines = @"
import { NavbarComponent } from '../../shared/components/navbar.component';
import { FooterComponent } from '../../shared/components/footer.component';
import { ChatboxComponent } from '../../shared/components/chatbox.component';
"@

foreach ($component in $componentsToUpdate) {
    Write-Host "Processing: $component"
    
    $content = Get-Content $component -Raw
    
    # Check if already has navbar
    if ($content -match "NavbarComponent") {
        Write-Host "  - Already has NavbarComponent, skipping"
        continue
    }
    
    # Find the line after the last import
    $lines = Get-Content $component
    $lastImportIndex = -1
    for ($i = 0; $i -lt $lines.Length; $i++) {
        if ($lines[$i] -match "^import ") {
            $lastImportIndex = $i
        }
    }
    
    if ($lastImportIndex -ge 0) {
        # Insert the imports after the last import
        $newLines = @()
        for ($i = 0; $i -le $lastImportIndex; $i++) {
            $newLines += $lines[$i]
        }
        $newLines += $importLines.Split("`n")
        for ($i = $lastImportIndex + 1; $i -lt $lines.Length; $i++) {
            $newLines += $lines[$i]
        }
        
        $newLines | Set-Content $component
        Write-Host "  - Added imports"
    }
}

Write-Host "Done!"
