import { Module } from '@nestjs/common';
import { CiudadSupermercadoService } from './providers/ciudad-supermercado/ciudad-supermercado.service';
import { CiudadSupermercadoController } from './controllers/ciudad-supermercado/ciudad-supermercado.controller';

@Module({
  providers: [CiudadSupermercadoService],
  controllers: [CiudadSupermercadoController]
})
export class CiudadSupermercadoModule {}
