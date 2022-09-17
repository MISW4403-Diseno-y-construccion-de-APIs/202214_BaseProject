import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from '../../../ciudad/entities/ciudad.entity';
import { SupermercadoEntity } from '../../../supermercado/entities/supermercado.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../../../shared/errors/business-errors';


@Injectable()
export class CiudadSupermercadoService {
    public mensajeErrorCiudad = "No se encontró la ciudad con la identificación proporcionada.";
    public mensajeErrorSupermercado = "No se encontró el supermercado con la identificación proporcionada.";
    public mensajeId = "El id no puede ser null.";

    constructor(
        @InjectRepository(SupermercadoEntity)
        private readonly supermercadoRepository: Repository<SupermercadoEntity>,
     
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>
    ) {}


    //Asociar un supermercado a una ciudad.
    async addSupermarketToCity(supermercadoId:string, ciudadId:string){
        const ciudad: CiudadEntity =  await this.ciudadRepository.findOne({where:{id:ciudadId},  relations:["supermercados"] });
        if(!ciudad)
            throw new BusinessLogicException(this.mensajeErrorCiudad, BusinessError.NOT_FOUND);

        const supermercado: SupermercadoEntity =  await this.supermercadoRepository.findOne({where:{id: supermercadoId}, });
        if(!supermercado)
            throw new BusinessLogicException(this.mensajeErrorSupermercado, BusinessError.NOT_FOUND);

        const searchSupermercado = ciudad.supermercados.find( (item) => item.id === supermercado.id);
        if(searchSupermercado){
            throw new BusinessLogicException("El supermercado ya se encuentra vinculado.", BusinessError.NOT_FOUND);
        }

        ciudad.supermercados = [...ciudad.supermercados, supermercado];
        return await this.ciudadRepository.save(ciudad);        
    }

    //Obtener los supermercados que tiene una ciudad.
    async findSupermarketsFromCity(ciudadId:string){
        const ciudad: CiudadEntity =  await this.ciudadRepository.findOne({where:{id:ciudadId},  relations:["supermercados"] });
        if(!ciudad)
            throw new BusinessLogicException(this.mensajeErrorCiudad, BusinessError.NOT_FOUND);

        return ciudad.supermercados;

    }
    //Obtener un supermercado de una ciudad.
    async findSupermarketFromCity(supermercadoId:string, ciudadId:string){
        const ciudad: CiudadEntity =  await this.ciudadRepository.findOne({where:{id:ciudadId},  relations:["supermercados"] });
        if(!ciudad)
            throw new BusinessLogicException(this.mensajeErrorCiudad, BusinessError.NOT_FOUND);

        const searchSupermercado = ciudad.supermercados.find( (item) => item.id === supermercadoId);
        if(!searchSupermercado){
            throw new BusinessLogicException(this.mensajeErrorSupermercado, BusinessError.NOT_FOUND);
        }

        return searchSupermercado;
  
    }
    //Actualizar los supermercados que tiene una ciudad.
    updateSupermarketsFromCity(){
        
    }
    //Eliminar el supermercado que tiene una ciudad.
    deleteSupermarketFromCity(){
        
    }

}
