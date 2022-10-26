import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AeropuertoEntity } from "../aeropuerto/aeropuerto.entity";

@Entity()
export class AerolineaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;
    
    @Column()
    descripcion: string;
    
    @Column()
    fecha: string;

    @Column()
    web: string;

    @ManyToMany(() =>  AeropuertoEntity, aeropuerto => aeropuerto.aerolineas)
    aeropuertos: AeropuertoEntity[];
}
