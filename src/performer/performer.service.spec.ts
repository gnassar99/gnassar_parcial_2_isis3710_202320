/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
// import { BusinessLogicException } from '../shared/errors/business-errors';
import { PerformerEntity } from './performer.entity';
import { PerformerService } from './performer.service';

describe('PerformerService', () => {
  let service: PerformerService;
  let repository: Repository<PerformerEntity>;
  let performerList: PerformerEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PerformerService],
      imports: [...TypeOrmTestingConfig()]
    }).compile();

    service = module.get<PerformerService>(PerformerService);
    repository = module.get<Repository<PerformerEntity>>(getRepositoryToken(PerformerEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    performerList = [];
    for (let i = 0; i < 10; i++) {
      const performer = await repository.save({
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

  it('should return all performers', async () => {
    const result = await service.findAll();
    expect(result).not.toBeNull();    
    expect(result.length).toEqual(performerList.length);
    expect(result[0].id).toEqual(performerList[0].id);
    expect(result[1].id).toEqual(performerList[1].id);
  });

  it('should return one performer', async () => {
    const result = await service.findOne(performerList[0].id);
    expect(result).not.toBeNull();    
    expect(result.id).toEqual(performerList[0].id);
    expect(result.nombre).toEqual(performerList[0].nombre);
    expect(result.imagen).toEqual(performerList[0].imagen);
    expect(result.descripcion).toEqual(performerList[0].descripcion);    
  });

  it('findOne should throw an exception for an invalid id', async () => {
    await expect(() => service.findOne("999")).rejects.toHaveProperty("message", "The performer with the given id was not found");
  });

  it('should create a new performer', async () => {
    const performer : PerformerEntity = {
      id: '',
      nombre: faker.person.firstName(),
      imagen: faker.image.url(),
      descripcion: faker.lorem.words(5),
      albums: []
    };
    const performerCreated = await service.create(performer);
    expect(performerCreated).toBeDefined();
    expect(performerCreated.id).toBeDefined();
    expect(performerCreated.nombre).toEqual(performer.nombre);
    expect(performerCreated.imagen).toEqual(performer.imagen);
    expect(performerCreated.descripcion).toEqual(performer.descripcion);    
  });

  it('should not create a new performer with description longer than 100 characters', async () => {
    const performer : PerformerEntity = {
      id: '',
      nombre: faker.person.firstName(),
      imagen: faker.image.url(),
      descripcion: faker.lorem.sentences(100),
      albums: []
    };
    await expect(service.create(performer)).rejects.toHaveProperty("message", "The performer description cannot be more than 100 characters");
  });
});
