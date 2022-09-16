import { Module } from '@nestjs/common';
import { CiudadEntity } from './entities/ciudad.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadService } from './providers/ciudad.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
           CiudadEntity
        ])
    ],
    providers: [CiudadService],
})
export class CiudadModule {}
