import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadEntity } from 'src/ciudad/ciudad.entity';
import { SupermercadoEntity } from 'src/supermercado/supermercado.entity';
import { SupermercadoService } from 'src/supermercado/supermercado.service';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';

@Module({
  imports: [TypeOrmModule.forFeature([CiudadEntity, SupermercadoEntity])],
    providers: [CiudadSupermercadoService, SupermercadoService],
})
export class CiudadSupermercadoModule {}
