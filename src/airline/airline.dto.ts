import { Transform } from 'class-transformer';
import {IsDate, IsNotEmpty, IsString, IsUrl} from 'class-validator';
export class AirlineDto {

 @IsString()
 @IsNotEmpty()
 readonly name: string;

 @IsString()
 @IsNotEmpty()
 readonly description: string;

 @IsDate()
 @IsNotEmpty()
 @Transform( ({ value }) => new Date(value))
 readonly foundationDate: Date;

 @IsUrl()
 @IsNotEmpty()
 readonly webPage: string;
 
}