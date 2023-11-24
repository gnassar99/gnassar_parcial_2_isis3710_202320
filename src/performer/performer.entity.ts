/* eslint-disable prettier/prettier */
import { AlbumEntity } from "../album/album.entity";
import { Column, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

export class PerformerEntity {
    // tiene un nombre (String), una imagen (String), una descripción (String) y un id (UUID).
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    imagen: string;

    @Column()
    descripcion: string;

    @ManyToMany(() => AlbumEntity, album => album.performers)
    @JoinTable()
    albums: AlbumEntity[];
    
}
