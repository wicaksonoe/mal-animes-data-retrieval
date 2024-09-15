import { v4 as newGuid } from 'uuid';
import http from './axios';
import { Anime, AppDataSource } from './dataSource';

async function Main() {
  await AppDataSource.initialize().then(() => {
    console.log('Data Source has been initialized!');
  });

  for (let i = 1; i <= 70_000; i++) {
    try {
      const response = await http.get(`/anime/${i}`, { params: { fields: 'title,synopsis,genres' } });

      const data = {
        id: newGuid(),
        mal_id: response.data.id,
        title: response.data.title,
        synopsis: response.data.synopsis.replaceAll('\n', '').replaceAll('\r', ''),
        genres: response.data.genres
          .map((genre: { name: string }) => genre.name.toLowerCase().replaceAll(' ', '_'))
          .join(','),
      };

      await AppDataSource.manager.save(AppDataSource.manager.create(Anime, data));
      console.log(`${i} saved`);
    } catch (error) {
      console.error(`${i} not found`);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log('Done');
}

Main();
