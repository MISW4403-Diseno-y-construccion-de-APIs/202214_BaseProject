import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AerolineaEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @Column()
    fechaFundacion: Date;

    @Column()
    paginaWeb: string;

    @ManyToMany(() => AeropuertoEntity, aeropuerto => aeropuerto.aerolineas)
    @JoinTable() // ya que se desea consultar la cobertura de las aerolíneas, aerolinea es es dueño de la asociaciòn. Aerolinea agrega aeropuertos
    aeropuertos: AeropuertoEntity[];

}
