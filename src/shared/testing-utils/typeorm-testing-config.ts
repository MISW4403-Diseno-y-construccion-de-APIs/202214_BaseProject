import { TypeOrmModule } from "@nestjs/typeorm";
import { SupermercadoEntity } from "../../supermercado/entities/supermercado.entity";
import { CiudadEntity } from "../../ciudad/entities/ciudad.entity";


export const TypeOrmTestingConfig = () => [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [
       CiudadEntity,
       SupermercadoEntity
      ],
      synchronize: true,
      keepConnectionAlive: true
    }),
    TypeOrmModule.forFeature([
        CiudadEntity,
        SupermercadoEntity
    ]),
   ];
   