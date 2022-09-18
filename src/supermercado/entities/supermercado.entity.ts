import { CiudadEntity } from "../../ciudad/entities/ciudad.entity";
import { Column, PrimaryGeneratedColumn, ManyToOne , Entity, JoinTable, ManyToMany} from "typeorm";

@Entity()
export class SupermercadoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    latitud: string;

    @Column()
    longitud: string;

    @Column()
    pagina: string;

    @ManyToMany(() => CiudadEntity, ciudad => ciudad.supermercados)
    @JoinTable()
    ciudades: CiudadEntity[];
}
