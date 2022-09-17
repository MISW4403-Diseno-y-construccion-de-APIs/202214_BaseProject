import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupermercadoEntity } from './entities/supermercado.entity';
import { SupermercadoService } from './providers/supermercado.service';
import { SupermercadoController } from './controllers/supermercado/supermercado.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
           SupermercadoEntity
        ])
    ],
    providers: [SupermercadoService],
    controllers: [SupermercadoController],
})
export class SupermercadoModule {}
