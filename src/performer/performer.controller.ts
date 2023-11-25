/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { PerformerEntity } from './performer.entity';
import { PerformerService } from './performer.service';
import { PerformerDto } from './performer.dto/performer.dto';

@Controller('performer')
@UseInterceptors(BusinessErrorsInterceptor)
export class PerformerController {
    constructor(private readonly _performerService: PerformerService) {}

    @Get()
    async findAll(){
        return await this._performerService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string){
        return await this._performerService.findOne(id);
    }

    @Post()
    async create(@Body() performerDto: PerformerDto){
        const performer: PerformerEntity = plainToInstance(PerformerEntity, performerDto);
        return await this._performerService.create(performer);
    }
}