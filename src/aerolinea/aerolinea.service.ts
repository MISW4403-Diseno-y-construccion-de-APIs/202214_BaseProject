import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { AerolineaEntity } from './aerolinea.entity';

@Injectable()
export class AerolineaService {

    constructor(
        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>
    ){}

    private readonly aerolineaNotFoundMessage: string =
    'La aerolinea con el id dado no fue encontrada';
 
    async findAll(): Promise<AerolineaEntity[]> {
        return await this.aerolineaRepository.find({ relations: ["aeropuertos"] });
    }
 
    async findOne(id: string): Promise<AerolineaEntity> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id}, relations: ["aeropuertos"] } );
        if (!aerolinea)
          throw new BusinessLogicException(this.aerolineaNotFoundMessage, BusinessError.NOT_FOUND);
   
        return aerolinea;
    }
   
    async create(aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        return await this.aerolineaRepository.save(aerolinea);
    }
 
    async update(id: string, aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        const persistedaerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where:{id}});
        if (!persistedaerolinea)
          throw new BusinessLogicException(this.aerolineaNotFoundMessage, BusinessError.NOT_FOUND);
       
        aerolinea.id = id; 
       
        return await this.aerolineaRepository.save(aerolinea);
    }
 
    async delete(id: string) {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where:{id}});
        if (!aerolinea)
          throw new BusinessLogicException(this.aerolineaNotFoundMessage, BusinessError.NOT_FOUND);
     
        await this.aerolineaRepository.remove(aerolinea);
    }

}
