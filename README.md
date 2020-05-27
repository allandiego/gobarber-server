# GoBarber
## Installing
This API runs on NodeJs and needs Postgres, MongoDB and Redis.

```
docker run --name postgres_gobarber -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
```
```
docker run --name mongodb_gobarber -p 27017:27017 -d -t mongo
```
```
docker run --name redis_gobarber -p 6379:6379 -d -t redis
```

### Initial Configuration

Create a database named `gobarber` and make sure you have the extension `uuid-ossp` instaled

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

And then run:

```
yarn typeorm migration:run
```

### Getting started
```
yarn dev:start
```
