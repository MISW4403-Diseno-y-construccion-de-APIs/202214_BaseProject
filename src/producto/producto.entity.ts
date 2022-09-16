import { TiendaEntity } from '../tienda/tienda.entity';
import { Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Column, Double } from 'typeorm';

@Entity()
export class ProductoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
    name: string;
  
  @Column()
    price: Double;

  @Column()
    type: string;
  
  @ManyToMany(() => TiendaEntity, (tienda) => tienda.productos)
  tiendas: TiendaEntity[];

}
