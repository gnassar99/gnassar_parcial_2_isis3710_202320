/* eslint-disable prettier/prettier */

import { PerformerEntity } from "src/performer/performer.entity";
import { PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";


export class AlbumEntity {
// un nombre (String), una carátula (String) una fecha de lanzamiento (Date), una descripción (String) y un id (UUID).
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    caratula: string;

    @Column()
    fechaLanzamiento: Date;

    @Column()
    descripcion: string;

    @ManyToMany(() => PerformerEntity, performer => performer.albums)
    performers: PerformerEntity[];    
}


