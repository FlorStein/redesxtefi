# Script para verificar la configuración DNS de GitHub Pages
# Uso: .\check-dns.ps1

$domain = "redesportefi.com"

Write-Host "Verificando DNS para $domain..." -ForegroundColor Cyan
Write-Host ""

# Verificar registros A
Write-Host "Registros A encontrados:" -ForegroundColor Yellow
try {
    $aRecords = Resolve-DnsName -Name $domain -Type A -ErrorAction SilentlyContinue
    if ($aRecords) {
        foreach ($record in $aRecords) {
            Write-Host "  $($record.IPAddress)" -ForegroundColor Green
        }
    } else {
        Write-Host "  No se encontraron registros A" -ForegroundColor Red
    }
} catch {
    Write-Host "  Error al consultar registros A" -ForegroundColor Red
}

Write-Host ""

# IPs esperadas de GitHub Pages
$expectedIPs = @("185.199.108.153", "185.199.109.153", "185.199.110.153", "185.199.111.153")
Write-Host "IPs esperadas de GitHub Pages:" -ForegroundColor Yellow
foreach ($ip in $expectedIPs) {
    Write-Host "  $ip" -ForegroundColor Gray
}

Write-Host ""

# Verificar CNAME para www
Write-Host "Verificando www.$domain..." -ForegroundColor Yellow
try {
    $cnameRecord = Resolve-DnsName -Name "www.$domain" -Type CNAME -ErrorAction SilentlyContinue
    if ($cnameRecord) {
        Write-Host "  CNAME: $($cnameRecord.NameHost)" -ForegroundColor Green
        Write-Host "  (Debería ser: florstein.github.io)" -ForegroundColor Gray
    } else {
        Write-Host "  No se encontró registro CNAME para www" -ForegroundColor Red
    }
} catch {
    Write-Host "  No se encontró registro CNAME para www" -ForegroundColor Red
}

Write-Host ""
Write-Host "Verificación en línea:" -ForegroundColor Cyan
Write-Host "  https://www.whatsmydns.net/#A/$domain" -ForegroundColor Blue
Write-Host ""
