import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from "src/producto/producto.entity";
import { TiendaEntity } from "src/tienda/tienda.entity";



export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [ProductoEntity, TiendaEntity],
   synchronize: true,
   keepConnectionAlive: true
 }),
 TypeOrmModule.forFeature([ProductoEntity, TiendaEntity]),
];