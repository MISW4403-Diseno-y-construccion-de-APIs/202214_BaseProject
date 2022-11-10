import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { esPaisPermitido } from '../shared/validations/business-validations';
import { Repository } from 'typeorm';
import { CiudadEntity } from './ciudad.entity';

@Injectable()
export class CiudadService {
    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>
    ){}

    async findAll(): Promise<CiudadEntity[]> {
        return await this.ciudadRepository.find({ });
    }

    async findOne(id: string): Promise<CiudadEntity> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id} } );
        if (!ciudad)
          throw new BusinessLogicException("La ciudad no fue encontrada", BusinessError.NOT_FOUND);
   
        return ciudad;
    }

    async create(ciudad: CiudadEntity): Promise<CiudadEntity> {
        if (!esPaisPermitido(ciudad.pais))
            throw new BusinessLogicException("La ciudad no pertenece a los paises permitidos", BusinessError.PRECONDITION_FAILED);
        return await this.ciudadRepository.save(ciudad);
            
    }

    async update(id: string, ciudad: CiudadEntity): Promise<CiudadEntity> {
        const persistedCiudad: CiudadEntity = await this.ciudadRepository.findOne({where:{id}});
        if (!persistedCiudad)
            throw new BusinessLogicException("La ciudad con el id dado no fue encontrada", BusinessError.NOT_FOUND);
        if (!esPaisPermitido(ciudad.pais))
            throw new BusinessLogicException("La ciudad no pertenece a los paises permitidos", BusinessError.PRECONDITION_FAILED);
        return await this.ciudadRepository.save({...persistedCiudad, ...ciudad});
    }

    async delete(id: string) {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where:{id}});
        if (!ciudad)
          throw new BusinessLogicException("La ciudad con el id dado no fue encontrada", BusinessError.NOT_FOUND);
     
        await this.ciudadRepository.remove(ciudad);
    }
}
