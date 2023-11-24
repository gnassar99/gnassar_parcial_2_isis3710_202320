import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformerAlbumService } from './performer-album.service';
import { AlbumEntity } from '../album/album.entity';
import { PerformerEntity } from '../performer/performer.entity';

@Module({
  providers: [PerformerAlbumService],
  imports: [TypeOrmModule.forFeature([AlbumEntity, PerformerEntity])],
})
export class PerformerAlbumModule {}
