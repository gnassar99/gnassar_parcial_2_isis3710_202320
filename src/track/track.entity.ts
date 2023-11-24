/* eslint-disable prettier/prettier */
import { AlbumEntity } from "../album/album.entity";
import { PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from "typeorm";

export class TrackEntity {
 // cual tiene un nombre (String), una duración (Number) y un id (UUID).

 @PrimaryGeneratedColumn ('uuid')
 id: string;

 @Column()
 nombre: string;

 @Column()
 duracion: number;

 @JoinColumn()
 @ManyToOne(() => AlbumEntity, album => album.tracks)
    album: AlbumEntity;
}
