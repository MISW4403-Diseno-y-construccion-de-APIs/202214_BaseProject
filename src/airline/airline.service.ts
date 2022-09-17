import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { AirlineEntity } from './airline.entity';

@Injectable()
export class AirlineService {

    constructor(
        @InjectRepository(AirlineEntity)
        private readonly airlineRepository: Repository<AirlineEntity>
    ){}

    private readonly airlineNotFoundMessage: string =
    'The airline with the given id was not found';
 
    async findAll(): Promise<AirlineEntity[]> {
        return await this.airlineRepository.find({ relations: ["airports"] });
    }
 
    async findOne(id: string): Promise<AirlineEntity> {
        const airline: AirlineEntity = await this.airlineRepository.findOne({where: {id}, relations: ["airports"] } );
        if (!airline)
          throw new BusinessLogicException(this.airlineNotFoundMessage, BusinessError.NOT_FOUND);
   
        return airline;
    }
   
    async create(airline: AirlineEntity): Promise<AirlineEntity> {

        const currentDate =  new Date(Date.now());

        if(airline.foundationDate > currentDate)
            throw new BusinessLogicException(
                "Foundation date invalid. The foundation date should be before the current date",
                BusinessError.PRECONDITION_FAILED,
            ) 

        return await this.airlineRepository.save(airline);
    }
 
    async update(id: string, airline: AirlineEntity): Promise<AirlineEntity> {
        const persistedairline: AirlineEntity = await this.airlineRepository.findOne({where:{id}});
        if (!persistedairline)
          throw new BusinessLogicException(this.airlineNotFoundMessage, BusinessError.NOT_FOUND);
       
        const currentDate =  new Date(Date.now());
        if(airline.foundationDate > currentDate)
            throw new BusinessLogicException(
                "Foundation date invalid. The foundation date should be before the current date",
                BusinessError.PRECONDITION_FAILED,
            ) 

        airline.id = id; 
       
        return await this.airlineRepository.save(airline);
    }
 
    async delete(id: string) {
        const airline: AirlineEntity = await this.airlineRepository.findOne({where:{id}});
        if (!airline)
          throw new BusinessLogicException(this.airlineNotFoundMessage, BusinessError.NOT_FOUND);
     
        await this.airlineRepository.remove(airline);
    }

}
