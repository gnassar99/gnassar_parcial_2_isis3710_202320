import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformerAlbumService } from './performer-album.service';
import { AlbumEntity } from '../album/album.entity';
import { PerformerEntity } from '../performer/performer.entity';
import { PerformerAlbumController } from './performer-album.controller';

@Module({
  providers: [PerformerAlbumService],
  imports: [TypeOrmModule.forFeature([AlbumEntity, PerformerEntity])],
  controllers: [PerformerAlbumController],
})
export class PerformerAlbumModule {}
