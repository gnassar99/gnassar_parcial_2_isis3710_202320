/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { AlbumEntity } from '../album/album.entity';
import { PerformerEntity } from '../performer/performer.entity';

@Injectable()
export class PerformerAlbumService {
    constructor(
        @InjectRepository(AlbumEntity)
        private readonly albumRepository: Repository<AlbumEntity>,
        @InjectRepository(PerformerEntity)
        private readonly performerRepository: Repository<PerformerEntity>,
    ) {}

    async addPerformerToAlbum(albumId: string, performerId: string): Promise<AlbumEntity> {
        const album: AlbumEntity = await this.albumRepository.findOne({where: {id: albumId}, relations: ['performers', 'tracks']});
        if (!album) {
            throw new BusinessLogicException('The album with the given id was not found', BusinessError.NOT_FOUND);
        }        
        if (album.performers.length > 3) {
            throw new BusinessLogicException('The album cannot have more than three performers associated', BusinessError.BAD_REQUEST);
        }
        const performer: PerformerEntity = await this.performerRepository.findOne({where: {id: performerId}, relations: ['albums']});
        if (!performer) {
            throw new BusinessLogicException('The performer with the given id was not found', BusinessError.NOT_FOUND);
        }

        album.performers = [...album.performers, performer];
        return await this.albumRepository.save(album);
    }

}
        
