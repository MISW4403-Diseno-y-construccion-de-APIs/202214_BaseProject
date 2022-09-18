import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CiudadModule } from './ciudad/ciudad.module';
import { CiudadEntity } from './ciudad/entities/ciudad.entity';
import { SupermercadoEntity } from './supermercado/entities/supermercado.entity';
import { SupermercadoModule } from './supermercado/supermercado.module';
import { CiudadSupermercadoModule } from './ciudad-supermercado/ciudad-supermercado.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Assemblix86',
      database: 'supermercado',
      entities: [
       CiudadEntity,
       SupermercadoEntity
      ],
      dropSchema: false,
      synchronize: true,
      keepConnectionAlive: true
    }),
    CiudadModule, SupermercadoModule, CiudadSupermercadoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
