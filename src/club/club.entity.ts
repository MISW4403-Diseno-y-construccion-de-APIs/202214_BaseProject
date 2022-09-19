import { SocioEntity } from "../socio/socio.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm";

@Entity()
export class ClubEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  fechaFundacion: Date;

  @Column()
  imagenUrl: string;

  @Column()
  descripcion: string;

  @ManyToMany(() => SocioEntity, (socio) => socio.clubes)
  socios: SocioEntity[];

}
