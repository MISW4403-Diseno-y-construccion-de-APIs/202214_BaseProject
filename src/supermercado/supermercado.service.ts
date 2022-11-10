import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { tieneLongitudRequerida } from '../shared/validations/business-validations';
import { Repository } from 'typeorm';
import { SupermercadoEntity } from './supermercado.entity';

@Injectable()
export class SupermercadoService {
    constructor(
        @InjectRepository(SupermercadoEntity)
        private readonly supermercadoRepository: Repository<SupermercadoEntity>
    ){}

    async findAll(): Promise<SupermercadoEntity[]> {
        return await this.supermercadoRepository.find({ });
    }

    async findOne(id: string): Promise<SupermercadoEntity> {
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id} } );
        if (!supermercado)
          throw new BusinessLogicException("El supermercado no fue encontrado", BusinessError.NOT_FOUND);
   
        return supermercado;
    }

    async create(supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
        if (!tieneLongitudRequerida(supermercado.nombre))
            throw new BusinessLogicException("El nombre del supermercado no tiene la longitud requerida", BusinessError.PRECONDITION_FAILED);    
        return await this.supermercadoRepository.save(supermercado);  
    }

    async update(id: string, supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
        const persistedSupermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where:{id}});
        if (!persistedSupermercado)
            throw new BusinessLogicException("El supermercado con el id dado no fue encontrado", BusinessError.NOT_FOUND);
        if (!tieneLongitudRequerida(supermercado.nombre))
            throw new BusinessLogicException("El nombre del supermercado no tiene la longitud requerida", BusinessError.PRECONDITION_FAILED);
        return await this.supermercadoRepository.save({...persistedSupermercado, ...supermercado});     
    }

    async delete(id: string) {
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where:{id}});
        if (!supermercado)
          throw new BusinessLogicException("El supermercado con el id dado no fue encontrado", BusinessError.NOT_FOUND);
     
        await this.supermercadoRepository.remove(supermercado);
    }
}
