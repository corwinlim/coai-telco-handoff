param(
  [string]$Url = 'https://coai-telco-handoff.vercel.app/',
  [string]$ExpectedSha256 = 'ed927901d0d382880ce5926ea2b35695f605baf2c29fbb0e7cca3155c2b62256'
)
$ErrorActionPreference = 'Stop'
try {
  $uri = [Uri]$Url
  if ($uri.Scheme -ne 'https' -or !$uri.Host -or $uri.UserInfo) { throw 'HTTPS_REQUIRED' }
  $result = Invoke-WebRequest -Uri $uri.AbsoluteUri -UseBasicParsing -MaximumRedirection 5 -TimeoutSec 30
  if ($result.StatusCode -ne 200) { throw "HTTP_STATUS=$($result.StatusCode)" }
  if ($result.Content -notmatch 'CoAi Telco Handoff' -or $result.Content -notmatch 'SYNTHETIC DATA DEMO') { throw 'WRONG_PAGE_CONTENT' }
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($result.Content)
  $hashObject = [System.Security.Cryptography.SHA256]::Create()
  try { $sha = ([BitConverter]::ToString($hashObject.ComputeHash($bytes))).Replace('-','').ToLowerInvariant() }
  finally { $hashObject.Dispose() }
  if ($sha -ne $ExpectedSha256) { throw "CONTENT_HASH_MISMATCH expected=$ExpectedSha256 actual=$sha" }
  Write-Output 'PASS HTTPS and HTTP 200'
  Write-Output 'PASS title and synthetic-data disclosure'
  Write-Output "PASS SHA256=$sha"
  Write-Output 'PUBLIC_HTTP_GATE=PASS'
  Write-Output 'NOTE: Browser interaction and download still require human verification.'
} catch {
  Write-Output "PUBLIC_HTTP_GATE=FAIL: $($_.Exception.Message)"
  exit 1
}
