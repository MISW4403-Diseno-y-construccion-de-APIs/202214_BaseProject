import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CiudadEntity } from '../entities/ciudad.entity';

@Injectable()
export class CiudadService {
    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>,
    ){}

    public mensajeError = "No se encontró la ciudad con la identificación proporcionada.";

    async create(ciudad: CiudadEntity): Promise<CiudadEntity> {
        return await this.ciudadRepository.save(ciudad);
    }

    async update(id: string, ciudad: CiudadEntity): Promise<CiudadEntity> {
        const persiteCiudad: CiudadEntity = await this.ciudadRepository.findOne({where:{id}});
        if (!persiteCiudad)
          throw new BusinessLogicException(this.mensajeError, BusinessError.NOT_FOUND);
        
        return await this.ciudadRepository.save({...persiteCiudad, ...ciudad});
    }

    async delete(id: string) {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where:{id}});
        if (!ciudad)
          throw new BusinessLogicException(this.mensajeError, BusinessError.NOT_FOUND);
     
        await this.ciudadRepository.remove(ciudad);
    }

    async findOne(id: string): Promise<CiudadEntity> {
        const ciudad: CiudadEntity =  await this.ciudadRepository.findOne({where:{id} });
        if(!ciudad)
            throw new BusinessLogicException(this.mensajeError, BusinessError.NOT_FOUND);

        return ciudad;
    }

    async findAll(): Promise<CiudadEntity[]> {
        return await this.ciudadRepository.find();
    }


}
