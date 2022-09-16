import { SupermercadoEntity } from "../../supermercado/entities/supermercado.entity";
import { Column, PrimaryGeneratedColumn, OneToMany, Entity } from "typeorm";

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

    @OneToMany(() => SupermercadoEntity, supermercado => supermercado.ciudad)
    supermercados: SupermercadoEntity[];
}
