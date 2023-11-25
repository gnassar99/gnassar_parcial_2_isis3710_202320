/* eslint-disable prettier/prettier */
import { Controller, Param, Post, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { PerformerAlbumService } from './performer-album.service';

@Controller('performer-album')
@UseInterceptors(BusinessErrorsInterceptor)
export class PerformerAlbumController {
    constructor(private readonly _performerAlbumService: PerformerAlbumService) {}

    @Post('/album/:albumId/performer/:performerId')
    async addPerformerToAlbum(@Param('albumId') albumId: string, @Param('performerId') performerId: string){
        return await this._performerAlbumService.addPerformerToAlbum(albumId, performerId);
    }

}

