import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class AirlineAirportService {

    private readonly airportNotFoundMessage: string =
    'The airport with the given id was not found';

    private readonly airlineNotFoundMessage: string =
    'The airline with the given id was not found';

    private readonly airportNotAssociateAirlineMsg: string = 
    "The airport with the given id is not associated to the airline";

    constructor(
        @InjectRepository(AirlineEntity)
        private readonly airlineRepository: Repository<AirlineEntity>,
    
        @InjectRepository(AirportEntity)
        private readonly airportRepository: Repository<AirportEntity>
    ) {}
 
    async addAirportToAirline(airlineId: string, airportId: string): Promise<AirlineEntity> {
        const airport: AirportEntity = await this.airportRepository.findOne({where: {id: airportId}});
        if (!airport)
          throw new BusinessLogicException(this.airportNotFoundMessage, BusinessError.NOT_FOUND);
      
        const airline: AirlineEntity = await this.airlineRepository.findOne({where: {id: airlineId}, relations: ["airports"]})
        if (!airline)
          throw new BusinessLogicException(this.airlineNotFoundMessage, BusinessError.NOT_FOUND);
    
        airline.airports = [...airline.airports, airport];
        return await this.airlineRepository.save(airline);
      }
    
    async findAirportFromAirline(airlineId: string, airportId: string): Promise<AirportEntity> {
        const airport: AirportEntity = await this.airportRepository.findOne({where: {id: airportId}});
        if (!airport)
          throw new BusinessLogicException(this.airportNotFoundMessage, BusinessError.NOT_FOUND)
       
        const airline: AirlineEntity = await this.airlineRepository.findOne({where: {id: airlineId}, relations: ["airports"]});
        if (!airline)
          throw new BusinessLogicException(this.airlineNotFoundMessage, BusinessError.NOT_FOUND)
   
        const airlineAirport: AirportEntity = airline.airports.find(e => e.id === airport.id);
   
        if (!airlineAirport)
          throw new BusinessLogicException(this.airportNotAssociateAirlineMsg, BusinessError.PRECONDITION_FAILED)
   
        return airlineAirport;
    }
    
    async findAirportsFromAirline(airlineId: string): Promise<AirportEntity[]> {
        const airline: AirlineEntity = await this.airlineRepository.findOne({where: {id: airlineId}, relations: ["airports"]});
        if (!airline)
          throw new BusinessLogicException(this.airlineNotFoundMessage, BusinessError.NOT_FOUND)
       
        return airline.airports;
    }
    
    async updateAirportsFromAirline(airlineId: string, airports: AirportEntity[]): Promise<AirlineEntity> {
        const airline: AirlineEntity = await this.airlineRepository.findOne({where: {id: airlineId}, relations: ["airports"]});
    
        if (!airline)
          throw new BusinessLogicException(this.airlineNotFoundMessage, BusinessError.NOT_FOUND)
    
        for (let i = 0; i < airports.length; i++) {
          const airport: AirportEntity = await this.airportRepository.findOne({where: {id: airports[i].id}});
          if (!airport)
            throw new BusinessLogicException(this.airportNotFoundMessage, BusinessError.NOT_FOUND)
        }
    
        airline.airports = airports;
        return await this.airlineRepository.save(airline);
      }
    
    async deleteAirportFromAirline(airlineId: string, airportId: string){
        const airport: AirportEntity = await this.airportRepository.findOne({where: {id: airportId}});
        if (!airport)
          throw new BusinessLogicException(this.airportNotFoundMessage, BusinessError.NOT_FOUND)
    
        const airline: AirlineEntity = await this.airlineRepository.findOne({where: {id: airlineId}, relations: ["airports"]});
        if (!airline)
          throw new BusinessLogicException(this.airlineNotFoundMessage, BusinessError.NOT_FOUND)
    
        const airlineAirport: AirportEntity = airline.airports.find(e => e.id === airport.id);
    
        if (!airlineAirport)
            throw new BusinessLogicException(this.airportNotAssociateAirlineMsg, BusinessError.PRECONDITION_FAILED)
 
        airline.airports = airline.airports.filter(e => e.id !== airportId);
        await this.airlineRepository.save(airline);
    }  

}
