import { ProductoEntity } from '../producto/producto.entity';
import { Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class TiendaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
    name: string;

  @Column()
    city: string;
  
  @Column()
    address: string;
  
  @ManyToMany(() => ProductoEntity, (producto) => producto.tiendas)
  @JoinTable()
  productos: ProductoEntity[];

}
