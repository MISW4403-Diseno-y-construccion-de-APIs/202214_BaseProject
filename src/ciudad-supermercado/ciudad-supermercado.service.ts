import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class CiudadSupermercadoService {
    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>,

        @InjectRepository(SupermercadoEntity)
        private readonly supermercadoRepository: Repository<SupermercadoEntity>){}

    // Asociar un supermercado a una ciudad.
    async addSupermarketToCity(ciudadId: string, supermercadoId: string): Promise<CiudadEntity> {
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: supermercadoId}});
        if (!supermercado)
            throw new BusinessLogicException("El supermercado no fue encontrado", BusinessError.NOT_FOUND);
    
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}, relations: ["supermercados"]})
        if (!ciudad)
            throw new BusinessLogicException("La ciudad con el id dado no fue encontrada", BusinessError.NOT_FOUND);

        ciudad.supermercados = [...ciudad.supermercados, supermercado];
        return await this.ciudadRepository.save(ciudad);

    }

    // Obtener los supermercados que tiene una ciudad.
    async findSupermarketFromCity(ciudadId: string): Promise<SupermercadoEntity[]> {
        const ciudadEncontrada: CiudadEntity =
        await this.ciudadRepository.findOne({
            where: { id: ciudadId },
            relations: ['supermercados'],
        });

        if (!ciudadEncontrada) {
            throw new BusinessLogicException('No existe la ciudad con el id indicado', BusinessError.NOT_FOUND,);
        }
        return ciudadEncontrada.supermercados;
    }

    // Obtener un supermercado de una ciudad
    async findSupermarketsFromCity(ciudadId: string, supermercadoId: string): Promise<SupermercadoEntity> {
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: supermercadoId}});
        if (!supermercado)
            throw new BusinessLogicException("El supermercado con el id dado no fue encontrado", BusinessError.NOT_FOUND);
    
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}, relations: ["supermercados"]})
        if (!ciudad)
            throw new BusinessLogicException("La ciudad con el id dado no fue encontrada", BusinessError.NOT_FOUND);

        const ciudadSupermercado: SupermercadoEntity = ciudad.supermercados.find(e => e.id === supermercado.id);

        if (!ciudadSupermercado)
            throw new BusinessLogicException("El supermercado con el id dado no esta asociado a la ciudad", BusinessError.PRECONDITION_FAILED)

        return ciudadSupermercado;
    }

    // Actualizar los supermercados que tiene una ciudad.
    async updateSupermarketsFromCity(ciudadId: string, supermercados: SupermercadoEntity[]): Promise<CiudadEntity> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}, relations: ["supermercados"]});
        if (!ciudad)
            throw new BusinessLogicException("La ciudad con el id dado no fue encontrada", BusinessError.NOT_FOUND)
    
        for (const element of supermercados) {
            const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: element.id}});
            if (!supermercado)
                throw new BusinessLogicException("El supermercado con el id dado no fue encontrado", BusinessError.NOT_FOUND);
        }
    
        ciudad.supermercados = supermercados;
        return await this.ciudadRepository.save(ciudad);
    }

    // Eliminar el supermercado que tiene una ciudad.
    async deleteSupermarketFromCity(ciudadId: string, supermercadoId: string){
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: supermercadoId}});
            if (!supermercado)
                throw new BusinessLogicException("El supermercado con el id dado no fue encontrado", BusinessError.NOT_FOUND);
    
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}, relations: ["supermercados"]});
            if (!ciudad)
                throw new BusinessLogicException("La ciudad con el id dado no fue encontrada", BusinessError.NOT_FOUND)
    
        const ciudadSupermercado: SupermercadoEntity = ciudad.supermercados.find(e => e.id === supermercado.id);
    
        if (!ciudadSupermercado)
            throw new BusinessLogicException("El supermercado con el id dado no esta asociado a la ciudad", BusinessError.PRECONDITION_FAILED)
    
        ciudad.supermercados = ciudad.supermercados.filter(e => e.id !== supermercadoId);
        await this.ciudadRepository.save(ciudad);
    }  
}
