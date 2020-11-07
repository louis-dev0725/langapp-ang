cd /d %~dp0\..
echo "Virtual Machine for this project (created using Vagrant) will be removed."
echo "(you can exit using Ctrl + C)"
pause
vagrant destroy -f
pause