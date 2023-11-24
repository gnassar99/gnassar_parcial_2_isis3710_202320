/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { TrackEntity } from './track.entity';

@Injectable()
export class TrackService {
    constructor(
        @InjectRepository(TrackEntity)
        private readonly trackRepository: Repository<TrackEntity>
    ) { }

    async findAll(): Promise<TrackEntity[]> {
        return await this.trackRepository.find({relations: ['album']});
    }

    async findOne(id: string): Promise<TrackEntity> {
        const track: TrackEntity = await this.trackRepository.findOne({where: {id}, relations: ['album']});
        if (!track) {
            throw new BusinessLogicException('The track with the given id was not found', BusinessError.NOT_FOUND);
        }
        return track;
    }

    async create(track: TrackEntity, albumId: string): Promise<TrackEntity> {
        const newTrack: TrackEntity = await this.trackRepository.create(track);        
        if (newTrack.duracion <= 0) {
            throw new BusinessLogicException('The track duration must be positive', BusinessError.BAD_REQUEST);
        }
        const album: TrackEntity = await this.trackRepository.findOne({where: {id: albumId}});
        if (!album) {
            throw new BusinessLogicException('The album associated with the track was not found', BusinessError.NOT_FOUND);
        }
        
        return await this.trackRepository.save(newTrack);
    }
}