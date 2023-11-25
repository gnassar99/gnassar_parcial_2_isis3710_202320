/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import {Repository} from 'typeorm';
import { faker} from '@faker-js/faker';
import {getRepositoryToken} from '@nestjs/typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { PerformerAlbumService } from './performer-album.service';
import { AlbumEntity } from '../album/album.entity';
import { PerformerEntity } from '../performer/performer.entity';



describe('PerformerAlbumService', () => {
  let service: PerformerAlbumService;
  let albumRepository: Repository<AlbumEntity>;
  let performerRepository: Repository<PerformerEntity>;
  let albumList: AlbumEntity[];
  let performerList: PerformerEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PerformerAlbumService],
      imports: [...TypeOrmTestingConfig()]
    }).compile();

    service = module.get<PerformerAlbumService>(PerformerAlbumService);
    albumRepository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    performerRepository = module.get<Repository<PerformerEntity>>(getRepositoryToken(PerformerEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    albumRepository.clear();
    performerRepository.clear();
    albumList = [];
    performerList = [];
    for (let i = 0; i < 10; i++) {
      const album = await albumRepository.save({
        id: i.toString(),
        nombre: faker.person.firstName(),
        caratula: faker.image.url(),
        fechaLanzamiento: faker.date.past(),        
        descripcion: faker.lorem.sentence(2),
      })
      albumList.push(album);
    }    

    for (let i = 0; i < 10; i++) {
      const performer = await performerRepository.save({
        id: i.toString(),
        nombre: faker.person.firstName(),
        imagen: faker.image.url(),
        descripcion: faker.lorem.sentences(2)
      })
      performerList.push(performer);
    }    
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add a performer to an album', async () => {
    const album = albumList[0];
    const performer = performerList[0];
    const result = await service.addPerformerToAlbum(album.id, performer.id);
    expect(result).toBeDefined();
    expect(result.performers.length).toBe(1);
    expect(result.performers[0].id).toBe(performer.id);
    expect(result.performers[0].nombre).toBe(performer.nombre);
    expect(result.performers[0].imagen).toBe(performer.imagen);
    expect(result.performers[0].descripcion).toBe(performer.descripcion);    
  });

  it('should throw an exception when the album does not exist', async () => {
    const performer = performerList[0];
    try {
      await service.addPerformerToAlbum('999', performer.id);
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toBe('The album with the given id was not found');
    }
  });

  it('should throw an exception when the performer does not exist', async () => {
    const album = albumList[0];
    try {
      await service.addPerformerToAlbum(album.id, '999');
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toBe('The performer with the given id was not found');
    }
  });

  it('should throw an exception when the album already has already three performers', async () => {
    const album = albumList[0];
    const performer1 = performerList[0];
    const performer2 = performerList[1];
    const performer3 = performerList[2];
    const performer4 = performerList[3];
    await service.addPerformerToAlbum(album.id, performer1.id);
    await service.addPerformerToAlbum(album.id, performer2.id);
    await service.addPerformerToAlbum(album.id, performer3.id);
    try {
      await service.addPerformerToAlbum(album.id, performer4.id);
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toBe('The album cannot have more than three performers associated');
    }
  });

});
