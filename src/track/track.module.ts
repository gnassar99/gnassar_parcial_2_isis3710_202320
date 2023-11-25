/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from './track.entity';
import { TrackController } from './track.controller';
import { AlbumModule } from '../album/album.module';
import { AlbumEntity } from 'src/album/album.entity';

@Module({
  providers: [TrackService],
  imports : [TypeOrmModule.forFeature([TrackEntity, AlbumEntity]), AlbumModule],
  controllers: [TrackController],
})
export class TrackModule {}
