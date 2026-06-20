# Inicia MongoDB local usando data/db do projeto (sem Docker).
# Uso: .\scripts\start-mongodb.ps1

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$dataDir = Join-Path $ProjectRoot "data\db"
New-Item -ItemType Directory -Force -Path $dataDir | Out-Null

$mongod = Get-Command mongod -ErrorAction SilentlyContinue
if (-not $mongod) {
    $candidates = Get-ChildItem "C:\Program Files\MongoDB\Server\*\bin\mongod.exe" -ErrorAction SilentlyContinue |
        Sort-Object { [version]$_.Directory.Parent.Name } -Descending
    if ($candidates) {
        $mongodPath = $candidates[0].FullName
    } else {
        Write-Host "mongod nao encontrado. Execute .\scripts\setup-local.ps1 ou configure MongoDB Atlas." -ForegroundColor Red
        exit 1
    }
} else {
    $mongodPath = $mongod.Source
}

Write-Host "Iniciando MongoDB em $dataDir ..." -ForegroundColor Cyan
Write-Host "URI: mongodb://localhost:27017" -ForegroundColor Green
& $mongodPath --dbpath $dataDir --port 27017
