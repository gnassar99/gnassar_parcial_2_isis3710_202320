/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
// import { BusinessLogicException } from '../shared/errors/business-errors';
import { AlbumEntity } from '../album/album.entity';
import { AlbumService } from '../album/album.service';
import { TrackEntity } from '../track/track.entity';

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
    const album : AlbumEntity = {
      id: '',
      nombre: faker.person.firstName(),
      caratula: faker.image.url(),
      fechaLanzamiento: faker.date.past(),
      // descripcion menor a 100 caracteres
      descripcion: faker.lorem.sentence(2),
      performers: [],
      tracks: []
    };
    const albumCreated = await service.create(album);
    expect(albumCreated).toBeDefined();
    expect(albumCreated.id).toBeDefined();
    expect(albumCreated.nombre).toEqual(album.nombre);
    expect(albumCreated.caratula).toEqual(album.caratula);
    expect(albumCreated.fechaLanzamiento).toEqual(album.fechaLanzamiento);    

    const storedAlbum = await repository.findOne({where: {id: albumCreated.id}});
    expect(storedAlbum).toBeDefined();
    expect(storedAlbum.id).toEqual(albumCreated.id);
    expect(storedAlbum.nombre).toEqual(albumCreated.nombre);
    expect(storedAlbum.caratula).toEqual(albumCreated.caratula);
    expect(storedAlbum.fechaLanzamiento).toEqual(albumCreated.fechaLanzamiento);
    
  });

  
  it('should not create a new album with empty description', async () => {
    const album: AlbumEntity = {
      id: '',
      nombre: faker.person.firstName(),
      caratula: faker.image.url(),
      fechaLanzamiento: faker.date.past(),
      // descripcion menor a 100 caracteres
      descripcion: '',
      performers: [],
      tracks: []
    };
    
    await expect(service.create(album)).rejects.toHaveProperty("message", "The album description cannot be empty")
  }
  );

  it('should not create a new album with empty name', async () => {
    const album: AlbumEntity = {
      id: '',
      nombre: '',
      caratula: faker.image.url(),
      fechaLanzamiento: faker.date.past(),
      // descripcion menor a 100 caracteres
      descripcion: faker.lorem.sentence(2),
      performers: [],
      tracks: []
    };    
    await expect(service.create(album)).rejects.toHaveProperty("message", "The album name cannot be empty")
  }
  );

  it('should find all albums', async () => {
    const albums = await service.findAll();
    expect(albums).toBeDefined();
    expect(albums.length).toEqual(albumList.length);
    expect(albums[0].id).toEqual(albumList[0].id);
    expect(albums[1].id).toEqual(albumList[1].id);
  });

  it ('should find an album by id', async () => {
    const album = albumList[0];
    const albumFound = await service.findOne(album.id);
    expect(albumFound).toBeDefined();
    expect(albumFound.id).toEqual(album.id);
    expect(albumFound.nombre).toEqual(album.nombre);
    expect(albumFound.caratula).toEqual(album.caratula);
    expect(albumFound.fechaLanzamiento).toEqual(album.fechaLanzamiento);
  }
  );

  it('findOne should throw an exception for an invalid album', async () => {
    await expect(() => service.findOne("999")).rejects.toHaveProperty("message", "The album with the given id was not found");
  });

  it('should delete an album', async () => {
    const album = albumList[0];    
    await service.delete(album.id);
    const albumFound = await repository.findOne({where: {id: album.id}});
    expect(albumFound).toBeNull();
  });

  it('should not delete an album with associated tracks', async () => {
    const album = albumList[0];
    const track: TrackEntity = {
      id: '',
      nombre: faker.person.firstName(),
      duracion: faker.number.int(),
      album: album
    };
    const trackCreated = await repository.manager.getRepository(TrackEntity).save(track);
    album.tracks = [];
    album.tracks.push(trackCreated);
    await repository.save(album);    
    await expect(() => service.delete(album.id)).rejects.toHaveProperty("message", "The album cannot be deleted because it has associated tracks");
  });

  it('Cannot delete an album with invalid id', async () => {
    await expect(() => service.delete("999")).rejects.toHaveProperty("message", "The album with the given id was not found");
  });  

});
