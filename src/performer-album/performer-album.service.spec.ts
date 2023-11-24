/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { PerformerAlbumService } from '../performer-album/performer-album.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('PerformerAlbumService', () => {
  let service: PerformerAlbumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PerformerAlbumService],
      imports: [...TypeOrmTestingConfig()]
    }).compile();

    service = module.get<PerformerAlbumService>(PerformerAlbumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
