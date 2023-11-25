/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { TrackEntity } from './track.entity';
import { TrackService } from './track.service';
import { TrackDto } from './track.dto/track.dto';

@Controller('track')
@UseInterceptors(BusinessErrorsInterceptor)
export class TrackController {
    constructor(private readonly _trackService: TrackService) {}

    @Get()
    async findAll(){
        return await this._trackService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string){
        return await this._trackService.findOne(id);
    }

    @Post(':albumId')
    async create(@Body() trackDto: TrackDto, @Param('albumId') albumId: string){
        const track: TrackEntity = plainToInstance(TrackEntity, trackDto);
        return await this._trackService.create(track, albumId);
    }

}    