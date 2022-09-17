import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CiudadEntity } from '../entities/ciudad.entity';

@Injectable()
export class CiudadService {
    paises = ['Argentina', 'Ecuador', 'Paraguay']; 

    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>,
    ){}

    public mensajeError = "No se encontró la ciudad con la identificación proporcionada.";
    public mensajePais = "El país no se encuentra en la lista habilitada (Argentina, Ecuador, Paraguay).";
    public mensajeId = "El id no puede ser null.";

    async create(ciudad: CiudadEntity): Promise<CiudadEntity> {
        const pais = this.paises.find( element => element === ciudad.pais);
        if(!pais){
            throw new BusinessLogicException(this.mensajePais, BusinessError.NOT_FOUND);  
        }
        return await this.ciudadRepository.save(ciudad);
    }

    async update(id: string, ciudad: CiudadEntity): Promise<CiudadEntity> {
        this.validarPais(ciudad);

        if(id === "null"){
            throw new BusinessLogicException(this.mensajeId, BusinessError.NOT_FOUND);
        }

        const persiteCiudad: CiudadEntity = await this.ciudadRepository.findOne({where:{id}, relations:["supermercados"]});
        if (!persiteCiudad)
          throw new BusinessLogicException(this.mensajeError, BusinessError.NOT_FOUND);
        
        return await this.ciudadRepository.save({...persiteCiudad, ...ciudad});
    }

    async delete(id: string) {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where:{id}});
        this.validarPais(ciudad);

        await this.ciudadRepository.remove(ciudad);
    }

    async findOne(id: string): Promise<CiudadEntity> {
        const ciudad: CiudadEntity =  await this.ciudadRepository.findOne({where:{id}, relations:["supermercados"]});
        if(!ciudad)
            throw new BusinessLogicException(this.mensajeError, BusinessError.NOT_FOUND);

        return ciudad;
    }

    async findAll(): Promise<CiudadEntity[]> {
        return await this.ciudadRepository.find();
    }

    private validarPais(ciudad: CiudadEntity) {
        const pais = this.paises.find(element => element === ciudad.pais);
        if (!pais) {
            throw new BusinessLogicException(this.mensajePais, BusinessError.NOT_FOUND);
        }
    }

}
