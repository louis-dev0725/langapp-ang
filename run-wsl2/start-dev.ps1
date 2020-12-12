$winLocation = Split-Path (Split-Path ($MyInvocation.MyCommand.Path))
Push-Location ($winLocation)

$config = Get-Content 'run-wsl2\dev.json' | Out-String | ConvertFrom-Json

# unisonLocation=$(pwd)/run/bin/unison

$jobs = @()

wsl bash run/bin/lms

$wslJob = Start-Job -Init ([ScriptBlock]::Create("Set-Location '$pwd'")) { cmd /c 'wsl bash ./run-wsl2/_wsl2_sync.sh 2>&1' }
$jobs += $wslJob

$localJob = Start-Job -Init ([ScriptBlock]::Create("Set-Location '$pwd'")) { cmd /c '.\run\bin\unison.exe . socket://127.0.0.1:5000/ -batch -prefer newer -ignorelocks -ignorearchives 2>nul' }
$localJob = Start-Job -Init ([ScriptBlock]::Create("Set-Location '$pwd'")) { cmd /c '.\run\bin\unison.exe . socket://127.0.0.1:5000/ -batch -prefer newer -repeat watch -ignorelocks -ignorearchives' }
$jobs += $localJob

# Idle loop
While (1) {
    $JobsRunning = 0
    foreach ($job in $jobs) {
        if ($job.JobStateInfo.state -eq "Running") {
            $JobsRunning += 1
            Receive-Job $job
        }
   }
   #Write-Host ("$JobsRunning of " + $jobs.count + " jobs running")
   if ($JobsRunning -eq 0) {
       Break
   }
   Start-Sleep 1
}
 
Write-Host "All finished...!"