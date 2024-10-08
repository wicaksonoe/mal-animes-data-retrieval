# MyAnimeList Anime Database

- Containing 27817 animes per 6 October 2024
- All data obtained using [MyAnimeList API (beta ver.) (2)](https://myanimelist.net/apiconfig/references/api/v2)

## Database Schema

![database_schema](database_diagram.png)

Notes:

- MalId is Id from [MyAnimeList.net](https://myanimelist.net)
- Id and Guid is generated automatically and doesn't related with [MyAnimeList.net](https://myanimelist.net)
- Might contain duplicate or incomplete data, please consider to clean and verify by yourself
- `Animes.StartDate` and `Animes.EndDate` are unix timetstamp in seconds

## Running Project

### Via Docker

```bash
$ touch data_source_ver_2.sqlite
$ docker build -t mal_anime_retrieval .
$ docker run \
--env-file .env \
-v $(pwd)/data_source_ver_2.sqlite:/app/data_source_ver_2.sqlite \
-d mal_anime_retrieval
```

### Via Node

>Minimum Node Version 20.x

```bash
# dev mode
$ yarn i
$ yarn dev

# production mode
$ yarn i
$ yarn build
$ node dist/index.js
```
