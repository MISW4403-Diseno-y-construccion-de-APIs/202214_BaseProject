import { CiudadEntity } from "src/ciudad/entities/ciudad.entity";
import { Column, PrimaryGeneratedColumn, ManyToOne , Entity} from "typeorm";

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

    @Column()
    cantidadSedes: number;

    @ManyToOne(() => CiudadEntity, ciudad => ciudad.supermercados)
    ciudad: CiudadEntity;
}
