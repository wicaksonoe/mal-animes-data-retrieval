import { v4 as newGuid } from 'uuid';
import http from './axios';
import { Anime, AnimeGenre, AnimeRecommendation, AnimeStudio, AppDataSource, RelatedAnime } from './dataSource';
import moment from 'moment';

let x = 0;

async function getAndSaveDetailAnime(id: number): Promise<number> {
  x++;
  let statusCode: number = 200;

  const response = await http
    .get(`/anime/${id}`, {
      params: {
        fields:
          'title,synopsis,genres,start_date,end_date,nsfw,status,num_episodes,start_season,source,rating,studios,related_anime,recommendations,rank,mean,num_scoring_users',
      },
    })
    .catch((error) => {
      if (error.response) {
        console.error(`${id} not saved (${error.response.status}) - (req: ${x})`);
        statusCode = error.response.status;
      } else {
        console.error(`${error} - (req: ${x})`);
        statusCode = 0;
      }
    });

  if (response && statusCode == 200) {
    const start_date = moment.utc(response.data.start_date);
    const end_date = moment.utc(response.data.end_date);

    const anime = new Anime(
      response.data.id,
      response.data.title,
      response.data.synopsis,
      start_date.unix(),
      end_date.unix(),
      response.data.nsfw,
      response.data.status,
      response.data.num_episodes,
      response.data.source,
      response.data.rating,
      response.data.start_season?.year,
      response.data.start_season?.season,
      response.data.rank,
      response.data.mean,
      response.data.num_scoring_users
    );

    await AppDataSource.manager.save(anime);

    if (response.data.genres) {
      const genres: AnimeGenre[] = response.data.genres.map((genre: { name: string }): AnimeGenre => {
        const genreName = genre.name.toLowerCase().replaceAll(' ', '_');
        return new AnimeGenre(anime, genreName);
      });

      await AppDataSource.manager.save(genres);
    }

    if (response.data.related_anime) {
      const related_anime: RelatedAnime[] = response.data.related_anime.map(
        (related_anime: { node: { id: number }; relation_type: string }): RelatedAnime => {
          return new RelatedAnime(anime, related_anime.node.id, related_anime.relation_type);
        }
      );

      await AppDataSource.manager.save(related_anime);
    }

    if (response.data.recommendations) {
      const recommendations: AnimeRecommendation[] = response.data.recommendations.map(
        (recommendations: { node: { id: number }; num_recommendations: number }): AnimeRecommendation => {
          return new AnimeRecommendation(anime, recommendations.node.id, recommendations.num_recommendations);
        }
      );

      await AppDataSource.manager.save(recommendations);
    }

    if (response.data.studios) {
      const studios: AnimeStudio[] = response.data.studios.map((studios: { name: string }): AnimeStudio => {
        return new AnimeStudio(anime, studios.name);
      });

      await AppDataSource.manager.save(studios);
    }

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
  // 3. if request num is 150, wait 5m
  // 4. else save data and wait 1.1s
  for (let i = 1; i <= 70_000; i++) {
    await getAndSaveDetailAnime(i);

    if (x % 150 == 0 && x != 0) {
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
