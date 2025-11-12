# PowerShell smoke test for Windows users
$api = $env:REACT_APP_API_URL
if (-not $api) { $api = 'http://localhost:5000' }
Write-Host "Using API: $api"

function PostJson($url,$obj){
  return Invoke-RestMethod -Method Post -Uri $url -Body ($obj | ConvertTo-Json) -ContentType 'application/json'
}

Write-Host "Health check:`n" (Invoke-RestMethod "$api/api/health" | ConvertTo-Json)

Write-Host "Send OTP:`n"
$send = PostJson "$api/api/auth/send-otp" @{ phone = '9999999999' }
Write-Host ($send | ConvertTo-Json)

$dev_otp = $send.dev_otp
if (-not $dev_otp) { $dev_otp = '123456' }

Write-Host "Verify OTP:`n"
$verify = PostJson "$api/api/auth/verify-otp" @{ phone = '9999999999'; otp = $dev_otp }
Write-Host ($verify | ConvertTo-Json)

Write-Host "List hospitals:`n"
(Invoke-RestMethod "$api/api/hospitals" | ConvertTo-Json)

Write-Host "Create appointment (mock):`n"
$appt = PostJson "$api/api/appointments" @{ doctor_id = 'd1'; slot_id = "d1-$(Get-Date -Format yyyy-MM-dd)-0"; payment_method = 'pay_at_hospital' }
Write-Host ($appt | ConvertTo-Json)

Write-Host "Smoke test complete"
