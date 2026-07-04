$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$Script = Join-Path $Root "scripts\run_all.py"

if (Get-Command python -ErrorAction SilentlyContinue) {
    python $Script
}
elseif (Get-Command py -ErrorAction SilentlyContinue) {
    py $Script
}
else {
    throw "Python was not found on PATH. Run this script inside Codex or install Python, then rerun scripts/run_all.ps1."
}
