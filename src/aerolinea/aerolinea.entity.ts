import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';

@Entity()
export class AerolineaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column({ type: 'timestamptz' })
  fecha_fundacion: Date;

  @Column()
  website: string;

  @ManyToMany(() => AeropuertoEntity, (aeropuerto) => aeropuerto.aerolineas)
  @JoinTable()
  aeropuertos: AeropuertoEntity[];
}
