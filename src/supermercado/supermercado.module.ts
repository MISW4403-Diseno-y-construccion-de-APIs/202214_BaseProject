import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupermercadoEntity } from './entities/supermercado.entity';
import { SupermercadoService } from './providers/supermercado.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
           SupermercadoEntity
        ])
    ],
    providers: [SupermercadoService],
})
export class SupermercadoModule {}
