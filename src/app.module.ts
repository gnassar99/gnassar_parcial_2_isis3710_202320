/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';
import { PerformerModule } from './performer/performer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumEntity } from './album/album.entity';
import { TrackEntity } from './track/track.entity';
import { PerformerEntity } from './performer/performer.entity';
import { PerformerAlbumModule } from './performer-album/performer-album.module';


@Module({
  imports: [AlbumModule, TrackModule, PerformerModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'postgres',
      database: 'marketplace',
      entities: [AlbumEntity, TrackEntity, PerformerEntity],
      dropSchema: false,
      synchronize: true,
      keepConnectionAlive: true
    }),
    PerformerAlbumModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
