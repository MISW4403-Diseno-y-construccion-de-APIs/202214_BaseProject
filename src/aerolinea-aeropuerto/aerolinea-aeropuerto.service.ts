import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class AerolineaAeropuertoService {

    private readonly aeropuertoNotFoundMessage: string =
    'El aeropuerto con el id dado no fue encontrado';

    private readonly aerolineaNotFoundMessage: string =
    'La aerolinea con el id dado no fue encontrada';

    private readonly aeropuertoNotAssociateAerolineaMsg: string = 
    "El aeropuerto con el id dado no esta asociado a la aerolinea";

    constructor(
        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>,
    
        @InjectRepository(AeropuertoEntity)
        private readonly aeropuertoRepository: Repository<AeropuertoEntity>
    ) {}
 
    async addAeropuertoAerolinea(aerolineaId: string, aeropuertoId: string): Promise<AerolineaEntity> {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertoId}});
        if (!aeropuerto)
          throw new BusinessLogicException(this.aeropuertoNotFoundMessage, BusinessError.NOT_FOUND);
      
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaId}, relations: ["aeropuertos"]})
        if (!aerolinea)
          throw new BusinessLogicException(this.aerolineaNotFoundMessage, BusinessError.NOT_FOUND);
    
        aerolinea.aeropuertos = [...aerolinea.aeropuertos, aeropuerto];
        return await this.aerolineaRepository.save(aerolinea);
      }
    
    async findAeropuertoByAerolineaIdAeropuertoId(aerolineaId: string, aeropuertoId: string): Promise<AeropuertoEntity> {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertoId}});
        if (!aeropuerto)
          throw new BusinessLogicException(this.aeropuertoNotFoundMessage, BusinessError.NOT_FOUND)
       
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaId}, relations: ["aeropuertos"]});
        if (!aerolinea)
          throw new BusinessLogicException(this.aerolineaNotFoundMessage, BusinessError.NOT_FOUND)
   
        const aerolineaAeropuerto: AeropuertoEntity = aerolinea.aeropuertos.find(e => e.id === aeropuerto.id);
   
        if (!aerolineaAeropuerto)
          throw new BusinessLogicException(this.aeropuertoNotAssociateAerolineaMsg, BusinessError.PRECONDITION_FAILED)
   
        return aerolineaAeropuerto;
    }
    
    async findAeropuertosByAerolineaId(aerolineaId: string): Promise<AeropuertoEntity[]> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaId}, relations: ["aeropuertos"]});
        if (!aerolinea)
          throw new BusinessLogicException(this.aerolineaNotFoundMessage, BusinessError.NOT_FOUND)
       
        return aerolinea.aeropuertos;
    }
    
    async associateAeropuertosAerolinea(aerolineaId: string, aeropuertos: AeropuertoEntity[]): Promise<AerolineaEntity> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaId}, relations: ["aeropuertos"]});
    
        if (!aerolinea)
          throw new BusinessLogicException(this.aerolineaNotFoundMessage, BusinessError.NOT_FOUND)
    
        for (let i = 0; i < aeropuertos.length; i++) {
          const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertos[i].id}});
          if (!aeropuerto)
            throw new BusinessLogicException(this.aeropuertoNotFoundMessage, BusinessError.NOT_FOUND)
        }
    
        aerolinea.aeropuertos = aeropuertos;
        return await this.aerolineaRepository.save(aerolinea);
      }
    
    async deleteAeropuertoAerolinea(aerolineaId: string, aeropuertoId: string){
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertoId}});
        if (!aeropuerto)
          throw new BusinessLogicException(this.aeropuertoNotFoundMessage, BusinessError.NOT_FOUND)
    
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaId}, relations: ["aeropuertos"]});
        if (!aerolinea)
          throw new BusinessLogicException(this.aerolineaNotFoundMessage, BusinessError.NOT_FOUND)
    
        const aerolineaAeropuerto: AeropuertoEntity = aerolinea.aeropuertos.find(e => e.id === aeropuerto.id);
    
        if (!aerolineaAeropuerto)
            throw new BusinessLogicException(this.aeropuertoNotAssociateAerolineaMsg, BusinessError.PRECONDITION_FAILED)
 
        aerolinea.aeropuertos = aerolinea.aeropuertos.filter(e => e.id !== aeropuertoId);
        await this.aerolineaRepository.save(aerolinea);
    }  

}
