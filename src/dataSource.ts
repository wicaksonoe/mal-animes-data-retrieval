import { v4 as newGuid } from 'uuid';
import { Column, DataSource, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Animes' })
export class Anime {
  constructor(
    mal_id: number,
    title: string,
    synopsis: string,
    start_date: number,
    end_date: number,
    nsfw: string,
    status: string,
    num_episodes: number,
    source: string,
    rating: string,
    start_year: number,
    start_season: string,
    rank: number,
    mean: string,
    scoring_users: number
  ) {
    this.guid = newGuid();
    this.mal_id = mal_id;
    this.title = title;
    this.synopsis = synopsis;
    this.start_date = start_date;
    this.end_date = end_date;
    this.nsfw = nsfw;
    this.status = status;
    this.num_episodes = num_episodes;
    this.start_year = start_year;
    this.start_season = start_season;
    this.source = source;
    this.rating = rating;
    this.rank = rank;
    this.mean = mean;
    this.scoring_users = scoring_users;
  }

  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'Guid' })
  guid: string;

  @Column({ name: 'MalId' })
  mal_id: number;

  @Column({ name: 'Title' })
  title: string;

  @Column({ name: 'Synopsis', nullable: true })
  synopsis: string;

  @OneToMany(() => AnimeGenre, (genre) => genre.anime)
  genres: AnimeGenre[];

  @Column({ name: 'StartDate', nullable: true })
  start_date: number;

  @Column({ name: 'EndDate', nullable: true })
  end_date: number;

  @Column({ name: 'Nsfw', nullable: true })
  nsfw: string;

  @Column({ name: 'Status', nullable: true })
  status: string;

  @Column({ name: 'NumberOfEpisodes', nullable: true })
  num_episodes: number;

  @Column({ name: 'StartYear', nullable: true })
  start_year: number;

  @Column({ name: 'StartSeason', nullable: true })
  start_season: string;

  @Column({ name: 'Source', nullable: true })
  source: string;

  @Column({ name: 'Rating', nullable: true })
  rating: string;

  @Column({ name: 'Rank', nullable: true })
  rank: number;

  @Column({ name: 'MeanScore', nullable: true })
  mean: string;

  @Column({ name: 'ScoringUsers', nullable: true })
  scoring_users: number;

  @OneToMany(() => AnimeStudio, (studio) => studio.anime)
  studios: AnimeStudio[];

  @OneToMany(() => RelatedAnime, (related_anime) => related_anime.anime)
  related_anime: RelatedAnime[];

  @OneToMany(() => AnimeRecommendation, (recommendation) => recommendation.anime)
  recommendations: AnimeRecommendation[];
}

@Entity({ name: 'RelatedAnimes' })
export class RelatedAnime {
  constructor(anime: Anime, mal_id: number, relation_type: string) {
    this.guid = newGuid();
    this.anime = anime;
    this.mal_id = mal_id;
    this.relation_type = relation_type;
  }

  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'Guid' })
  guid: string;

  @ManyToOne(() => Anime, (anime) => anime.related_anime)
  anime: Anime;

  @Column({ name: 'MalId' })
  mal_id: number;

  @Column({ name: 'RelationType' })
  relation_type: string;
}

@Entity({ name: 'AnimeRecommendations' })
export class AnimeRecommendation {
  constructor(anime: Anime, mal_id: number, num_recommendations: number) {
    this.guid = newGuid();
    this.anime = anime;
    this.mal_id = mal_id;
    this.num_recommendations = num_recommendations;
  }

  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'Guid' })
  guid: string;

  @ManyToOne(() => Anime, (anime) => anime.recommendations)
  anime: Anime;

  @Column({ name: 'MalId' })
  mal_id: number;

  @Column({ name: 'NumberOfRecommendations' })
  num_recommendations: number;
}

@Entity({ name: 'AnimeStudios' })
export class AnimeStudio {
  constructor(anime: Anime, name: string) {
    this.guid = newGuid();
    this.anime = anime;
    this.name = name;
  }

  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'Guid' })
  guid: string;

  @ManyToOne(() => Anime, (anime) => anime.studios)
  anime: Anime;

  @Column({ name: 'Name' })
  name: string;
}

@Entity({ name: 'AnimeGenres' })
export class AnimeGenre {
  constructor(anime: Anime, name: string) {
    this.guid = newGuid();
    this.anime = anime;
    this.name = name;
  }

  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'Guid' })
  guid: string;

  @ManyToOne(() => Anime, (anime) => anime.studios)
  anime: Anime;

  @Column({ name: 'Name' })
  name: string;
}

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'data_source_ver_2.sqlite',
  synchronize: true,
  entities: [Anime, RelatedAnime, AnimeRecommendation, AnimeGenre, AnimeStudio],
  subscribers: [],
  migrations: [],
});
