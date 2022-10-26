import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AerolineaAeropuertoService {
    deleteAerolineaAeropuerto(aeropuertoId: string, aerolineaId: string) {
        throw new Error('Method not implemented.');
    }
    associateAerolineaAeropuerto(aeropuertoId: string, aeropuerto: AeropuertoEntity[]) {
        throw new Error('Method not implemented.');
    }
    findAerolineaIdAeropuertoId(aeropuertoId: string, aerolineaId: string) {
        throw new Error('Method not implemented.');
    }
    addAeropuertoAerolinea(aeropuertoId: string, aerolineaId: string) {
        throw new Error('Method not implemented.');
    }
    constructor(
        @InjectRepository(AeropuertoEntity)
        private readonly aeropuertoRepository: Repository<AeropuertoEntity>,
     
        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>
    ) {}

    async addAirportToAirline(aeropuertoId: string, aerolineaId: string): Promise<AeropuertoEntity> {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aerolineaId}});
        if (!aeropuerto)
          throw new BusinessLogicException("The aeropuerto with the given id was not found", BusinessError.NOT_FOUND);
       
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aeropuertoId}, relations: ["aerolineas"]}) 
        if (!aerolinea)
          throw new BusinessLogicException("The aerolinea with the given id was not found", BusinessError.NOT_FOUND);
     
        aeropuerto.aerolineas = [...aeropuerto.aerolineas, aerolinea];
        return await this.aeropuertoRepository.save(aeropuerto);
    }

    async findAirportsFromAirline(aeropuertoId: string, aerolineaId: string): Promise<AerolineaEntity> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaId}});
        if (!aerolinea)
          throw new BusinessLogicException("The aerolinea with the given id was not found", BusinessError.NOT_FOUND)
        
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertoId}, relations: ["aerolineas"]}); 
        if (!aeropuerto)
          throw new BusinessLogicException("The aeropuerto with the given id was not found", BusinessError.NOT_FOUND)
    
        const aeropuertoAerolinea: AerolineaEntity = aeropuerto.aerolineas.find(e => e.id === aerolinea.id);
    
        if (!aeropuertoAerolinea)
          throw new BusinessLogicException("The aerolinea with the given id is not associated to the aeropuerto", BusinessError.PRECONDITION_FAILED)
    
        return aeropuertoAerolinea;
    }
     
    async findAirportFromAirline(aeropuertoId: string): Promise<AerolineaEntity[]> {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertoId}, relations: ["aerolineas"]});
        if (!aeropuerto) {
          throw new BusinessLogicException("The aeropuerto with the given id was not found", BusinessError.NOT_FOUND)
        }
        return aeropuerto.aerolineas;
    }
          
    async deleteAirportFromAirline(aeropuertoId: string, aerolineaId: string){
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaId}});
        if (!aerolinea)
          throw new BusinessLogicException("The aerolinea with the given id was not found", BusinessError.NOT_FOUND)
        
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertoId}, relations: ["aerolineas"]}); 
        if (!aeropuerto)
          throw new BusinessLogicException("The aeropuerto with the given id was not found", BusinessError.NOT_FOUND)
    
        const aeropuertoAerolinea: AerolineaEntity = aeropuerto.aerolineas.find(e => e.id === aerolinea.id);
    
        if (!aeropuertoAerolinea)
          throw new BusinessLogicException("The aerolinea with the given id is not associated to the aeropuerto", BusinessError.PRECONDITION_FAILED)
    
        aeropuerto.aerolineas = aeropuerto.aerolineas.filter(e => e.id !== aerolineaId);
        await this.aeropuertoRepository.save(aeropuerto);
    }   
}
