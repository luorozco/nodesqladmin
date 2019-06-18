# nodesqladmin
MySQL/MariaDB process and variables control web-based

## Instalation and configuration

You need create a user with **super** and **process** permissions in all database for work.

```sql
create user <username>@<ip_host> identified by <password>;
create database <database_name>;
grant super, process on *.* to <username>@<ip_host>;
grant all privileges on <database_name>.* to <username>@<ip_host>;
```

To config the database connection for local application (not container) edit **keys.js** file and replace the content in the quotes.

```js
module.exports = {

    database: {
        host: process.env.HOSTDB || 'ip/host of database',
        user: process.env.USERDB ||'user database',
        password: process.env.PASSDB || 'password database',
        database: process.env.DBNAME || 'database name',
    }
    
};
```

Now you need install al dependences of the application. From the root folder of the app:

```bash
$ npm install
```

## Run app

You can run the app with the command:
```bash
$ npm start
```

Then app runs.

Or you can use containers with Docker:

```bash
$ docker run -p 8080:8080 -e PORT=8080 -e HOSTDB="host/ip" -e USERDB="username" -e PASSDB="pass db" -e DBNAME="database name" -d luorozco/nodesqladmin
```

## Install databases

In two options, for install the tables on database is simple. Go to ip_host:8080/install and follow the instructions.

