/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AlbumEntity } from './album.entity';
import { AlbumService } from './album.service';

import { faker } from '@faker-js/faker';

describe('AlbumService', () => {
  let service: AlbumService;
  let repository: Repository<AlbumEntity>;
  let albumList: AlbumEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlbumService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<AlbumService>(AlbumService);
    repository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    albumList = [];
    for(let i = 0; i < 10; i++){
        const album: AlbumEntity = await repository.save({
        id : i.toString(),
        nombre: faker.music.albumName(),
        caratula: faker.image.imageUrl(),
        fechaLanzamiento: faker.date.past(),
        descripcion: faker.lorem.paragraph(),
        performers: [],
        tracks: []        
        })
        albumList.push(album);
      }
    } 

  it('should be defined', () => {
    expect(service).toBeDefined();
  }
  );

  it('should create a new album', async () => {
    const album = albumList[0];
    const albumCreated = await service.create(album);
    expect(albumCreated).toBeDefined();
    expect(albumCreated.id).toBeDefined();
    expect(albumCreated.nombre).toEqual(album.nombre);
    expect(albumCreated.caratula).toEqual(album.caratula);
    expect(albumCreated.fechaLanzamiento).toEqual(album.fechaLanzamiento);    
  });

  
  it('should not create a new album with empty description', async () => {
    const album = albumList[0];
    album.descripcion = '';    
    await expect(service.create(album)).rejects.toHaveProperty("message", "The album description cannot be empty")
  }
  );
});
