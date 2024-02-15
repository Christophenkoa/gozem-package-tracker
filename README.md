# gozem-package-tracker
- Before starting the server, ypu need to install [mongodb](https://www.mongodb.com/docs/manual/administration/install-community)
- Use the default credential of mongo (nothing to configure as userb=name or password).
- Next `cd` into the repo and run `npm i` to install the dependencies.
- Make sure to free the 8000 port and run `npm run dev` for the development mode or `npm run build` follows by `npm run start` to run in production.

## Steps I didn't do cause of time:
- dockerize everything and run the 2 repo once with `docker-compose`
- Use [Mongo cloud Atlas](https://www.mongodb.com/cloud/atlas) to host the database.
- Complete unit test and create a fake database for testing.
- complete authentication flow

## credentials:
- admin: 
  email: admin@gmail.com
  password: password

- customer: 
  email: customer@gmail.com
  password: password

- driver: 
  email: driver@gmail.com
  password: password

## evironment variables
You can create a .env file in the root project and set the: 
- MONGO_URL (the mongo db's url).
- MONGO_DB_NAME (The mongoDb's database name).

