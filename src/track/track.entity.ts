/* eslint-disable prettier/prettier */
import { PrimaryGeneratedColumn, Column } from "typeorm";

export class TrackEntity {
 // cual tiene un nombre (String), una duración (Number) y un id (UUID).

 @PrimaryGeneratedColumn ('uuid')
 id: string;

 @Column()
 nombre: string;

 @Column()
 duracion: number;

}
