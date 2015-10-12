# report_generator

1. ```mkdir /var/www/generator && cd /var/www/generator```
2. ```git init```
3. ```git remote add origin clone git@github.com:johndavedecano/report_generator.git```
4. ```git pull origin master```
5. ```npm install```


# Running cron job everyday

1. ```sudo crontab -e```
2. ```@daily node /var/www/generator/main.js```
