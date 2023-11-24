/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { TrackService } from '../track/track.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('TrackService', () => {
  let service: TrackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrackService],
      imports: [...TypeOrmTestingConfig()]
    }).compile();

    service = module.get<TrackService>(TrackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
