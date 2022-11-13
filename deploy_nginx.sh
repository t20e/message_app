# //deploying a MERN app with nginx
# //tip if u are having trouble installing because ur ec2 is use low usage etc, change its instance type from t2.mirco
# //if u run load on storage for ec2 increase its EBS volume
# //tip maybe change all the routes before the build in the ssh not locally

# Prerequisite
    # //run code before deployment cd into react app
    #     npm run build
    # push to github
    # //IMPORTANT: mongodb doesnt yet have a build for ubuntu 22.04
    # create ec2 instance using ubuntu 18.04

    # 1. shh into instance run these commands
        # if u want to use root and not have to sudo every command then fo sudo su
        sudo apt update
        sudo apt upgrade -y
        sudo apt install nodejs npm nginx git -y
            # //ubuntu doesnt install the current node version by apt-get install nodejs
                curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
                sudo bash nodesource_setup.sh
                sudo apt install nodejs -y
                node -v
                # this should now print out version 14.7.0 or newer
                sudo apt install build-essential


    # 2. clone the repo and add any necessary files that were in the gitignore such as .env
    #     Next to make the following commands more copy-pasta-able we will export a variable on our server.
                export repoName=<ur repo name>
            # After exporting the variable, we can check to make sure it was set by echoing it. Echo will print the variable out in our terminal. 
                echo $repoName
                
    # 3. setup frontend
        cd ~/$repoName/client
        sudo rm -rf /var/www/html 
        sudo mv build /var/www/html
        sudo service nginx restart
                # FRONT END SHOULD NOW BE ON THE IP ADDRESS

    # 4. fixing our front-end routes
        # When we were developing before, our Back-End server was accessible on "http://localhost:8000" but when we deploy 
        # our project the Back-End will then be accessible at whatever our IP address happens to be. To fix the links we would
        # essentially need to go into our build folder and change all routes that look like this into routes that just start with "/".
        # While we could fire up vim and do just that we can instead use the power of BASH commands to make this change in one command.

                sudo grep -rl localhost /var/www/html | xargs sed -i 's/http:\/\/localhost:8000//g'
                    # //if permission err occurs then change the /var/www/html permissions                
                        sudo chown -R  ubuntu:ubuntu /var/www/html

        # This command will use grep (Global Regular Expression Print) to find all lines that contain the string "localhost" and pipe
        # them into sed (Stream Editor) which will do a find and replace to remove the matching string.
        # //tip: make sure u all routes are not localhost ex maybe on server side:

    # 5. setting up the backend
        cd ~/$repoName
        sudo npm i

    # 6. Next we need to get our Back-End server working. 
        wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -
        echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list
        sudo apt update
        sudo apt install -y mongodb-org
        sudo service mongod start
        service mongod status
                # //These commands will install MongoDB, start the MongoDB daemon, and display that daemon's status. You should see a message that looks like the following letting you know it's working.
                
    # 7. config nginx
        sudo rm /etc/nginx/sites-available/default
        sudo nano /etc/nginx/sites-available/default
        :'#past the following==>
# message_app_deployment Configuration 11-12-2022
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    root /var/www/html;
    index index.html index.htm index.nginx-debian.html;
    server_name message_app;
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;    
    }
    # location / {
        # try_files $uri $uri/ =404;
    # }
    error_page 404 /index.html;
}
        '
    # 8. 
        cd ~/$repoName
        sudo service nginx restart
        # //test
            node server.js
    # 9. wrapping up
        sudo npm install pm2@latest -g
        pm2 start server.js
        pm2 status
        # if u want pm2 tp start when server reboots or restarts then
            # unknown err when i tried to do this =>
            pm2 startup systemd
            pm2 save
            systemctl start pm2-root


# more info 
    # nginx logs are at
        /var/log/nginx
    # view cpu, server running instance, memory
        pm2 status
    # stop backend server, not frontend
        pm2 stop all

# UPDATING YOUR CODE AND REFRESHING YOUR INSTALLATION:
#     Update your code and test it on your local computer.
#     Stage and commit your code to your git repository using the command line or your VSCode editor's tools
#     Push the changes up to github: git push
#     Connect via SSH to your instance as described above

#     Change directory in to your project folder: cd ~/repoName
#     Stop the PM2 process daemon: 
        pm2 stop all
    # This should stop the express/node server
    # Pull the recent changes from github using: 
        git pull
    # Change directory in to the client folder: 
        cd client
    # Rebuild the React App: 
        npm run build
    # Stop the currently running nginx process:  
        sudo service nginx stop
        sudo service nginx status
    # Replace the running React App and remember to update the URLs using grep and sed:
        sudo rm -rf /var/www/html
        sudo mv build /var/www/html
        sudo grep -rl localhost /var/www/html | xargs sed -i 's/http:\/\/localhost:8000//g'
    # Restart the PM2 process: 
        pm2 restart all
    # This should restart your express/node server
    # Restart the React app
        sudo service nginx restart
        sudo service nginx status
    # To view the server logs while using PM2, run the following command:
            sudo pm2 logscopy
        # To exit viewing the logs use: 
            CTRL + c

:'
this was the configuration done for socket io to work with nginx however it u can find a way to do io("/socket.io) 
in the react client app then add it to the second location /socket.io it should work
# message_app_deployment Configuration 11-12-2022
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    root /var/www/html;
    index index.html index.htm index.nginx-debian.html;
    server_name message_app;
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;    
    }
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    # location / {
        # try_files $uri $uri/ =404;
    # }
    error_page 404 /index.html;
    location / {
        try_files $uri $uri/ =404;
    }
    error_page 404 /index.html;
}
'