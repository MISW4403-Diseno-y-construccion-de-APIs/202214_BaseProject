import { AirportEntity } from '../airport/airport.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AirlineEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    foundationDate: Date;

    @Column()
    webPage: string;

    @ManyToMany(() => AirportEntity, airport => airport.airlines)
    @JoinTable() // ya que se desea consultar la cobertura de las aerolíneas, aerolinea es es dueño de la asociaciòn. Airline agrega aeropuertos
    airports: AirportEntity[];

}
