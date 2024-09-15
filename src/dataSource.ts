import { Column, DataSource, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Anime {
  constructor(id: string, mal_id: number, title: string, synopsis: string, genres: string) {
    this.id = id;
    this.mal_id = mal_id;
    this.title = title;
    this.synopsis = synopsis;
    this.genres = genres;
  }

  @PrimaryColumn()
  id: string;

  @Column()
  mal_id: number;

  @Column()
  title: string;

  @Column()
  synopsis: string;

  @Column()
  genres: string;
}

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'data-source.sqlite',
  synchronize: true,
  entities: [Anime],
  subscribers: [],
  migrations: [],
});
