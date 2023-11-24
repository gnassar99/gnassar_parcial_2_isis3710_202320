/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
// import { BusinessLogicException } from '../shared/errors/business-errors';
import { AlbumEntity } from '../album/album.entity';
import { AlbumService } from '../album/album.service';

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
    for (let i = 0; i < 10; i++) {
      const album = await repository.save({
        id: i.toString(),
        nombre: faker.person.firstName(),
        caratula: faker.image.url(),
        fechaLanzamiento: faker.date.past(),
        // descripcion menor a 100 caracteres
        descripcion: faker.lorem.sentence(2),
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
