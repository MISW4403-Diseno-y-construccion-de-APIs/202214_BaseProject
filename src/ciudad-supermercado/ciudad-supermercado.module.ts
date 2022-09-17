import { Module } from '@nestjs/common';
import { CiudadSupermercadoService } from './providers/ciudad-supermercado/ciudad-supermercado.service';
import { CiudadSupermercadoController } from './controllers/ciudad-supermercado/ciudad-supermercado.controller';
import { CiudadEntity } from 'src/ciudad/entities/ciudad.entity';
import { SupermercadoEntity } from 'src/supermercado/entities/supermercado.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
       CiudadEntity,
       SupermercadoEntity
    ])
],
  providers: [CiudadSupermercadoService],
  controllers: [CiudadSupermercadoController]
})
export class CiudadSupermercadoModule {}
