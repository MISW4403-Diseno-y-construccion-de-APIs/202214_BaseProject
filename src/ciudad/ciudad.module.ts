import { Module } from '@nestjs/common';
import { CiudadEntity } from './entities/ciudad.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([
           CiudadEntity
        ])
    ],
})
export class CiudadModule {}
