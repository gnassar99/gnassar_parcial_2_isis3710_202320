/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { AlbumEntity } from './album.entity';

@Injectable()
export class AlbumService {
    constructor(
        @InjectRepository(AlbumEntity)
        private readonly albumRepository: Repository<AlbumEntity>
    ) { }

    async findAll(): Promise<AlbumEntity[]> {
        return await this.albumRepository.find({relations: ['performers', 'tracks']});
    }

    async findOne(id: string): Promise<AlbumEntity> {
        const album: AlbumEntity = await this.albumRepository.findOne({where: {id}, relations: ['performers', 'tracks']});
        if (!album) {
            throw new BusinessLogicException('The album with the given id was not found', BusinessError.NOT_FOUND);
        }
        return album;
    }

    async create(album: AlbumEntity): Promise<AlbumEntity> {
        const newAlbum: AlbumEntity = await this.albumRepository.create(album);        
        if (newAlbum.nombre === '') {
            throw new BusinessLogicException('The album name cannot be empty', BusinessError.BAD_REQUEST);
        }       
        if (newAlbum.descripcion === '') {
            throw new BusinessLogicException('The album description cannot be empty', BusinessError.BAD_REQUEST);
        }

        return await this.albumRepository.save(newAlbum);
    }

    async delete(id: string) {
        const album: AlbumEntity = await this.albumRepository.findOne({where:{id}, relations: ['performers', 'tracks']});
        if (!album) {
            throw new BusinessLogicException('The album with the given id was not found', BusinessError.NOT_FOUND);
        }                        
        if (album.tracks.length > 0) {
            throw new BusinessLogicException('The album cannot be deleted because it has associated tracks', BusinessError.BAD_REQUEST);
        }        
        await this.albumRepository.remove(album);
    }

}
