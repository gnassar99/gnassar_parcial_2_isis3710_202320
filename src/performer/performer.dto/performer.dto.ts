/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString} from 'class-validator';

export class PerformerDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;
    
    @IsNotEmpty()
    @IsString()
    imagen: string;
    
    @IsNotEmpty()
    @IsString()
    descripcion: string;
}
