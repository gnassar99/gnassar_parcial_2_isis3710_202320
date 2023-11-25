/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString} from 'class-validator';

export class AlbumDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;
    
    @IsNotEmpty()
    @IsString()
    caratula: string;
    
    @IsNotEmpty()
    fechaLanzamiento: Date;
    
    @IsNotEmpty()
    @IsString()
    descripcion: string;
}
