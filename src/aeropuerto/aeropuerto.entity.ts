import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';

@Entity()
export class AeropuertoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  codigo: string;

  @Column()
  ciudad: string;

  @Column()
  pais: string;

  @ManyToMany(() => AerolineaEntity, (aerolinea) => aerolinea.aeropuertos)
  aerolineas: AerolineaEntity[];
}
