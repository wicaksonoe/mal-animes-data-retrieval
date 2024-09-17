import { v4 as newGuid } from 'uuid';
import http from './axios';
import { Anime, AppDataSource } from './dataSource';

let x = 0;

async function getAndSaveDetailAnime(id: number): Promise<number> {
  x++;
  let statusCode: number = 200;

  const response = await http.get(`/anime/${id}`, { params: { fields: 'title,synopsis,genres' } }).catch((error) => {
    if (error.response) {
      console.error(`${id} not saved (${error.response.status}) - (req: ${x})`);
      statusCode = error.response.status;
    } else {
      console.error(`${error} - (req: ${x})`);
      statusCode = 0;
    }
  });

  if (response && statusCode == 200) {
    const data = {
      id: newGuid(),
      mal_id: response.data.id,
      title: response.data.title,
      synopsis: response.data.synopsis.replaceAll('\n', '').replaceAll('\r', ''),
      genres: '',
    };

    if (response.data.genres) {
      data.genres = response.data.genres
        .map((genre: { name: string }) => genre.name.toLowerCase().replaceAll(' ', '_'))
        .join(',');
    }

    await AppDataSource.manager.save(AppDataSource.manager.create(Anime, data));
    console.log(`${id} saved - (req: ${x})`);
  }

  if (statusCode == 503 || statusCode == 504) {
    console.log('cooldown 5m.....');
    await new Promise((resolve) => setTimeout(resolve, 5 * 70_000));

    x = 0;
    statusCode = await getAndSaveDetailAnime(id);
  }

  return statusCode;
}

async function Main() {
  await AppDataSource.initialize().then(() => {
    console.log('Data Source has been initialized!');
  });

  // 1. do request
  // 2. if response is 503, wait 5m, set request num to 1, and retry
  // 3. if request num is 300, wait 5m
  // 4. else save data and wait 1.1s
  for (let i = 1; i <= 70_000; i++) {
    await getAndSaveDetailAnime(i);

    if (x % 300 == 0 && x != 0) {
      console.log('cooldown 5m.....');
      x = 0;
      await new Promise((resolve) => setTimeout(resolve, 5 * 70_000));
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1_100));
    }
  }

  console.log('Done');
}

Main();
