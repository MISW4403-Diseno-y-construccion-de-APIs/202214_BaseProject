import { Module } from '@nestjs/common';
import { CiudadEntity } from './entities/ciudad.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadService } from './providers/ciudad.service';
import { CiudadController } from './controllers/ciudad/ciudad.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
           CiudadEntity
        ])
    ],
    providers: [CiudadService],
    controllers: [CiudadController],
})
export class CiudadModule {}
