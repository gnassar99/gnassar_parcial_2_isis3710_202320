/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker} from '@faker-js/faker';
// import { BusinessLogicException } from '../shared/errors/business-errors';
import { TrackEntity } from '../track/track.entity';
import { TrackService } from '../track/track.service';
import { AlbumEntity } from '../album/album.entity';
import { AlbumService } from '../album/album.service';

describe('TrackService', () => {
  let service: TrackService;
  let repository: Repository<TrackEntity>;
  let trackList: TrackEntity[];  
  let albumService: AlbumService;
  let albumRepository: Repository<AlbumEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrackService, AlbumService],
      imports: [...TypeOrmTestingConfig()]
    }).compile();

    service = module.get<TrackService>(TrackService);
    repository = module.get<Repository<TrackEntity>>(getRepositoryToken(TrackEntity));    
    albumService = module.get<AlbumService>(AlbumService);
    albumRepository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));

    await seedDatabase();    
  });

  const seedDatabase = async () => {
    repository.clear();
    trackList = [];
    for (let i = 0; i < 10; i++) {
      const track = await repository.save({
        id: i.toString(),
        nombre: faker.person.firstName(),
        duracion: faker.number.int({min: 0, max: 300}),
        album: null        
      })
      trackList.push(track);
    }    
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it ('album should be defined', () => {
    expect(albumService).toBeDefined();
  });

  it('should return all tracks', async () => {
    const tracks = await service.findAll();
    expect(tracks.length).toBe(trackList.length);
    expect(tracks[0].id).toBe(trackList[0].id);
    expect(tracks[0].nombre).toBe(trackList[0].nombre);
    expect(tracks[0].duracion).toBe(trackList[0].duracion);    
  });

  it('should return a track by id', async () => {
    const track = await service.findOne(trackList[0].id);
    expect(track.id).toBe(trackList[0].id);
    expect(track.nombre).toBe(trackList[0].nombre);
    expect(track.duracion).toBe(trackList[0].duracion);    
  });

  it('findOne should throw an exception for an invalid id', async () => {
    await expect(() => service.findOne("999")).rejects.toHaveProperty("message", "The track with the given id was not found");  
  });

  it('should create a new track', async () => {   
    albumRepository.clear();
    const album: AlbumEntity = await albumRepository.save({
      id: '',
      nombre: faker.person.firstName(),
      caratula: faker.image.url(),
      fechaLanzamiento: faker.date.past(),      
      descripcion: faker.lorem.sentence(2),
    })
    expect(album).toBeDefined();
    const albumFound = await albumRepository.findOne({where: {id: album.id}});
    expect(albumFound).toBeDefined();
    expect(albumFound.id).toBe(album.id);    
    expect(albumFound).toBeInstanceOf(AlbumEntity);

    const track : TrackEntity = {
      id: '',
      nombre: faker.person.firstName(),
      duracion: faker.number.int({min: 0, max: 300}),
      album: albumFound
    };

    const trackCreated = await service.create(track, albumFound.id);
    expect(trackCreated).toBeDefined();
    expect(trackCreated.id).toBeDefined();
    expect(trackCreated.nombre).toBe(track.nombre);
    expect(trackCreated.duracion).toBe(track.duracion);
    expect(trackCreated.album).toBeDefined();
    expect(trackCreated.album.id).toBe(album.id);

  });

  it('should not create a new track without album', async () => {
    const track : TrackEntity = {
      id: '',
      nombre: faker.person.firstName(),
      duracion: faker.number.int({min: 0, max: 300}),
      album: null
    };
    await expect(service.create(track, '999')).rejects.toHaveProperty("message", "The album associated with the track was not found");
  });

  it('should not create a new track with negative duration', async () => {
    albumRepository.clear();
    const album: AlbumEntity = await albumRepository.save({
      id: '',
      nombre: faker.person.firstName(),
      caratula: faker.image.url(),
      fechaLanzamiento: faker.date.past(),      
      descripcion: faker.lorem.sentence(2),
    })
    expect(album).toBeDefined();
    const albumFound = await albumRepository.findOne({where: {id: album.id}});
    expect(albumFound).toBeDefined();
    expect(albumFound.id).toBe(album.id);    
    expect(albumFound).toBeInstanceOf(AlbumEntity);

    const track : TrackEntity = {
      id: '',
      nombre: faker.person.firstName(),
      duracion: -1,
      album: albumFound
    };
    await expect(service.create(track, albumFound.id)).rejects.toHaveProperty("message", "The track duration must be positive");
  });
});
