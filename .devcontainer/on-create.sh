#!/bin/bash

sudo apt-get update
sudo apt-get install -y php7.4

cd /tmp
curl -fsSL https://raw.githubusercontent.com/tilt-dev/tilt/master/scripts/install.sh | bash

total_memory=$(free -g | awk '/^Mem:/{print $2}')

# Check if total memory is less than 8GB
if [ $total_memory -lt 8 ]; then
  sudo fallocate -l 8G /tmp/swapfile
  sudo chmod 600 /tmp/swapfile
  sudo mkswap /tmp/swapfile
  sudo swapon /tmp/swapfile
  echo '/tmp/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

true