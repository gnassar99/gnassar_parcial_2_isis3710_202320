/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { AlbumDto } from './album.dto/album.dto';
import { AlbumEntity } from '../album/album.entity';
import { AlbumService } from '../album/album.service';

@Controller('album')
@UseInterceptors(BusinessErrorsInterceptor)
export class AlbumController {
    constructor(private readonly _albumService: AlbumService) {}

    @Get()
    async findAll(){
        return await this._albumService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string){
        return await this._albumService.findOne(id);
    }

    @Post()
    async create(@Body() albumDto: AlbumDto){
        const album: AlbumEntity = plainToInstance(AlbumEntity, albumDto);
        return await this._albumService.create(album);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string){
        await this._albumService.delete(id);
    }

}