import { TiendaEntity } from '../tienda/tienda.entity';
import { Entity, ManyToMany, PrimaryGeneratedColumn, Column, Double } from 'typeorm';

@Entity()
export class ProductoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
    name: string;
  
  @Column()
    price: String;

  @Column()
    type: string;
  
  @ManyToMany(() => TiendaEntity, (tienda) => tienda.productos)
  tiendas: TiendaEntity[];

}
