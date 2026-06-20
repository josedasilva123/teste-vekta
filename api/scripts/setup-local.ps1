# Instala dependências locais (Poetry) e prepara ambiente de desenvolvimento.
# Uso: .\scripts\setup-local.ps1

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

Write-Host "==> Verificando Python..." -ForegroundColor Cyan
python --version

Write-Host "==> Instalando Poetry (se necessario)..." -ForegroundColor Cyan
if (-not (Get-Command poetry -ErrorAction SilentlyContinue)) {
    python -m pip install --upgrade pip
    python -m pip install poetry
}

Write-Host "==> Instalando dependencias do projeto..." -ForegroundColor Cyan
poetry install

Write-Host "==> Criando .env a partir de .env.example (se nao existir)..." -ForegroundColor Cyan
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    (Get-Content ".env") -replace "AI_PROVIDER=gemini", "AI_PROVIDER=fake" | Set-Content ".env"
    Write-Host "    .env criado com AI_PROVIDER=fake (sem necessidade de Gemini)." -ForegroundColor Yellow
}

Write-Host "==> Criando diretorio de dados do MongoDB..." -ForegroundColor Cyan
$dataDir = Join-Path $ProjectRoot "data\db"
New-Item -ItemType Directory -Force -Path $dataDir | Out-Null

Write-Host "==> Verificando MongoDB local..." -ForegroundColor Cyan
$mongod = Get-Command mongod -ErrorAction SilentlyContinue
if (-not $mongod) {
    Write-Host "    MongoDB nao encontrado. Tentando instalar via winget..." -ForegroundColor Yellow
    if (Get-Command winget -ErrorAction SilentlyContinue) {
        winget install MongoDB.Server --accept-package-agreements --accept-source-agreements
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
    } else {
        Write-Host "    winget nao disponivel. Opcoes:" -ForegroundColor Red
        Write-Host "    1. Instale MongoDB Community: https://www.mongodb.com/try/download/community"
        Write-Host "    2. Use MongoDB Atlas (gratis) e atualize MONGODB_URI no .env"
        Write-Host "    3. Rode apenas testes: poetry run pytest"
    }
} else {
    Write-Host "    MongoDB encontrado: $($mongod.Source)" -ForegroundColor Green
}

Write-Host ""
Write-Host "Setup concluido!" -ForegroundColor Green
Write-Host "Proximos passos:" -ForegroundColor Cyan
Write-Host "  1. .\scripts\start-mongodb.ps1   # se MongoDB local"
Write-Host "  2. poetry run chatterbox         # inicia a API"
Write-Host "  3. poetry run pytest             # roda testes"
