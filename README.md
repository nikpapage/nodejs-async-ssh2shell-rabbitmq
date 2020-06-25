# nodejs_async_ssh_rabbitmq

mkdir nodejs_async_ssh_rabbitmq
cd nodejs_async_ssh_rabbitmq

git clone https://github.com/nikpapage/nodejs_async_ssh_rabbitmq.git

chmod 744 install_rabbit.sh
sudo ./install_rabbit.sh

npm install
npm init

//modify using the env.example
source env.sh

nohup node server &
nohup node mq-receiver &

Use an upstream webserver, postman or curl to perform a post request on the server's url 

curl --location --request POST 'http://<server_host_url>:3000/echo' --header 'Content-Type: application/json;charset=UTF-8' --data-raw '"message in a bottle"'
