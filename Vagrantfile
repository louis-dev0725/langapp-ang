# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/focal64"

  config.vm.provider "virtualbox" do |v|
    v.memory = 2048
    v.cpus = 4
    v.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
    v.customize ["modifyvm", :id, "--natdnsproxy1", "on"]
  end

  #config.vm.provision :docker

  config.vm.synced_folder ".", "/vagrant", disabled: true
  config.vm.synced_folder ".", "/langapp", type: "rsync", rsync__exclude: [".git/", ".idea/"], rsync__rsync_ownership: true, rsync__verbose: true, rsync__chown: false
  
  config.vm.provision "shell", inline: "apt update"
  config.vm.provision "shell", inline: "apt install apt-transport-https ca-certificates curl gnupg-agent software-properties-common -y"
  config.vm.provision "shell", inline: "curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -"
  config.vm.provision "shell", inline: "add-apt-repository 'deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable' -y"
  config.vm.provision "shell", inline: "apt update"
  config.vm.provision "shell", inline: "apt install docker-ce docker-ce-cli containerd.io -y"

  config.vm.provision "shell", inline: 'curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose'
  config.vm.provision "shell", inline: 'chmod +x /usr/local/bin/docker-compose'

  config.vm.provision "shell", inline: 'chmod +x /langapp/run/bin/unison'
  config.vm.provision "shell", inline: 'chmod +x /langapp/run/bin/unison-fsmonitor'
  config.vm.provision "shell", inline: 'echo fs.inotify.max_user_watches=524288 | tee -a /etc/sysctl.conf && sysctl -p'
  
  config.vm.network :forwarded_port, guest: ENV["SYNC_PORT"] || 5000, host: ENV["SYNC_PORT"] || 5000, host_ip: "127.0.0.1" # Port for unison sync
  config.vm.network :forwarded_port, guest: ENV["HTTP_PORT"] || 80, host: ENV["HTTP_PORT"] || 80, host_ip: "127.0.0.1"
  config.vm.network :forwarded_port, guest: ENV["HTTPS_PORT"] || 443, host: ENV["HTTPS_PORT"] || 443, host_ip: "127.0.0.1"
  config.vm.network :forwarded_port, guest: ENV["POSTGRES_PORT"] || 5432, host: ENV["POSTGRES_PORT"] || 5432, host_ip: "127.0.0.1"
  config.vm.network :forwarded_port, guest: ENV["PGADMIN_PORT"] || 5001, host: ENV["PGADMIN_PORT"] || 5001, host_ip: "127.0.0.1"
  config.vm.network :forwarded_port, guest: ENV["ADMINER_PORT"] || 5002, host: ENV["ADMINER_PORT"] || 5002, host_ip: "127.0.0.1"
end