import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendaEntity } from './tienda.entity';
import { TiendaService } from './tienda.service';
imports:[TypeOrmModule.forFeature([TiendaEntity])]

@Module({
  providers: [TiendaService]
})
export class TiendaModule {}
