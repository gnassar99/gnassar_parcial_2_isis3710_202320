/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString} from 'class-validator';

export class TrackDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;
    
    @IsNotEmpty()
    duracion: number;
}
