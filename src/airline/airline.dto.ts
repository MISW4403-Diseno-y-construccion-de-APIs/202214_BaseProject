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
 readonly foundationDate: Date;

 @IsUrl()
 @IsNotEmpty()
 readonly webPage: string;
 
}