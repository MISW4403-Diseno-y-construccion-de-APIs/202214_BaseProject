import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from 'src/producto/producto.entity';
import { ProductoService } from 'src/producto/producto.service';

@Module({
 imports: [TypeOrmModule.forFeature([ProductoEntity])],
 providers: [ProductoService],
})
export class TiendaModule {}
