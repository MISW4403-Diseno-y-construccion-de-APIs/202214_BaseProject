import { SupermercadoEntity } from "../../supermercado/entities/supermercado.entity";
import { Column, PrimaryGeneratedColumn, OneToMany, Entity, ManyToMany } from "typeorm";

@Entity()
export class CiudadEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    pais: string;

    @Column()
    habitantes: number;

    @ManyToMany(() => SupermercadoEntity, supermercado => supermercado.ciudades)
    supermercados: SupermercadoEntity[];
}
