import {IsNotEmpty, IsString, IsUrl} from 'class-validator';

export class AeropuertoDto {
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;
    
    @IsString()
    @IsNotEmpty()
    readonly pais: string;
    
    @IsString()
    @IsNotEmpty()
    readonly ciudad: string;
}
