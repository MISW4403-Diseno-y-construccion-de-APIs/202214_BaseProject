import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';
import { Repository } from 'typeorm';
import { AirlineAirportService } from './airline-airport.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('AirlineAirportService', () => {
  let service: AirlineAirportService;
  let airlineRepository: Repository<AirlineEntity>;
  let airportRepository: Repository<AirportEntity>;
  let airline: AirlineEntity;
  let airportsList : AirportEntity[];

 const airportNotFoundMessage: string =
  'The airport with the given id was not found';

 const airlineNotFoundMessage: string =
  'The airline with the given id was not found';

 const airportNotAssociateAirlineMsg: string = 
  "The airport with the given id is not associated to the airline";

  const seedDatabase = async () => {
    airportRepository.clear();
    airlineRepository.clear();
 
    airportsList = [];
    for(let i = 0; i < 5; i++){
        const airport: AirportEntity = await airportRepository.save({
          name: faker.company.name(),
          code: faker.random.alphaNumeric(),
          country: faker.address.country(),
          city: faker.address.city()
        })
        airportsList.push(airport);
    }
 
    airline = await airlineRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      foundationDate: faker.date.past(),
      webPage: faker.internet.url(),
      airports: airportsList
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineAirportService],
    }).compile();

    service = module.get<AirlineAirportService>(AirlineAirportService);
    airlineRepository = module.get<Repository<AirlineEntity>>(getRepositoryToken(AirlineEntity));
    airportRepository = module.get<Repository<AirportEntity>>(getRepositoryToken(AirportEntity));
   
    await seedDatabase();
  
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAirportAirline should add a airport to a airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.random.alphaNumeric(),
      country: faker.address.country(),
      city: faker.address.city()
    });
 
    const newAirline: AirlineEntity = await airlineRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      foundationDate: faker.date.past(),
      webPage: faker.internet.url()
    })
 
    const result: AirlineEntity = await service.addAirportToAirline(newAirline.id, newAirport.id);
   
    expect(result.airports.length).toBe(1);
    expect(result.airports[0]).not.toBeNull();
    expect(result.airports[0].name).toBe(newAirport.name)
    expect(result.airports[0].city).toBe(newAirport.city)
    expect(result.airports[0].country).toBe(newAirport.country)
    expect(result.airports[0].code).toBe(newAirport.code)
  });

  it('addAirportAirline should thrown exception for invalid airport', async () => {
    const newAirline: AirlineEntity = await airlineRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      foundationDate: faker.date.past(),
      webPage: faker.internet.url()
    })
 
    await expect(() => service.addAirportToAirline(newAirline.id, "0")).rejects.toHaveProperty("message", airportNotFoundMessage);
  });

  it('addAirportAirline should throw an exception for an invalid airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.random.alphaNumeric(),
      country: faker.address.country(),
      city: faker.address.city()
    });
 
    await expect(() => service.addAirportToAirline("0", newAirport.id)).rejects.toHaveProperty("message", airlineNotFoundMessage);
  });

  it('findAirportByAirlineIdAirportId should return airport by airline', async () => {
    const airport: AirportEntity = airportsList[0];
    const storedAirport: AirportEntity = await service.findAirportFromAirline(airline.id, airport.id, )
    expect(storedAirport).not.toBeNull();
    expect(storedAirport.name).toBe(airport.name);
    expect(storedAirport.city).toBe(airport.city);
    expect(storedAirport.country).toBe(airport.country);
    expect(storedAirport.code).toBe(airport.code);
  });

  it('findAirportByAirlineIdAirportId should thrown exception for invalid airport', async () => {
    await expect(()=> service.findAirportFromAirline(airline.id, "0")).rejects.toHaveProperty("message", airportNotFoundMessage);
  });

  it('findAirportByAirlineIdAirportId should thrown exception for invalid airline', async () => {
    const airport: AirportEntity = airportsList[0];
    await expect(()=> service.findAirportFromAirline("0", airport.id)).rejects.toHaveProperty("message", airlineNotFoundMessage);
  });

  it('findAirportByAirlineIdAirportId should throw an exception for an airport not associated to the airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.random.alphaNumeric(),
      country: faker.address.country(),
      city: faker.address.city()
    });
 
    await expect(()=> service.findAirportFromAirline(airline.id, newAirport.id)).rejects.toHaveProperty("message", airportNotAssociateAirlineMsg);
  });

  it('findAirportsByAirlineId should return airport by airline', async ()=>{
    const airports: AirportEntity[] = await service.findAirportsFromAirline(airline.id);
    expect(airports.length).toBe(5)
  });

  it('findAirportsByAirlineId should throw an exception for an invalid airline', async () => {
    await expect(()=> service.findAirportsFromAirline("0")).rejects.toHaveProperty("message", airlineNotFoundMessage);
  });

  it('associateAirportsAirline should update airports list by airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.random.alphaNumeric(),
      country: faker.address.country(),
      city: faker.address.city()
    });
 
    const updatedAirline: AirlineEntity = await service.updateAirportsFromAirline(airline.id, [newAirport]);
    expect(updatedAirline.airports.length).toBe(1);
 
    expect(updatedAirline.airports[0].name).toBe(newAirport.name);
    expect(updatedAirline.airports[0].city).toBe(newAirport.city);
    expect(updatedAirline.airports[0].country).toBe(newAirport.country);
    expect(updatedAirline.airports[0].code).toBe(newAirport.code);
   
  });

  it('associateAirportsAirline should throw an exception for an invalid airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.random.alphaNumeric(),
      country: faker.address.country(),
      city: faker.address.city()
    });
 
    await expect(()=> service.updateAirportsFromAirline("0", [newAirport])).rejects.toHaveProperty("message", airlineNotFoundMessage);
  });

  it('associateAirportsAirline should throw an exception for an invalid airport', async () => {
    const newAirport: AirportEntity = airportsList[0];
    newAirport.id = "0";
 
    await expect(()=> service.updateAirportsFromAirline(airline.id, [newAirport])).rejects.toHaveProperty("message", airportNotFoundMessage);
  });

  it('deleteAirportToAirline should remove an airport from a airline', async () => {
    const airport: AirportEntity = airportsList[0];
   
    await service.deleteAirportFromAirline(airline.id, airport.id);
 
    const storedAirline: AirlineEntity = await airlineRepository.findOne({where: {id: airline.id}, relations: ["airports"]});
    const deletedAirport: AirportEntity = storedAirline.airports.find(a => a.id === airport.id);
 
    expect(deletedAirport).toBeUndefined();
 
  });

  it('deleteAirportToAirline should thrown an exception for an invalid airport', async () => {
    await expect(()=> service.deleteAirportFromAirline(airline.id, "0")).rejects.toHaveProperty("message", airportNotFoundMessage);
  });

  it('deleteAirportToAirline should thrown an exception for an invalid airline', async () => {
    const airport: AirportEntity = airportsList[0];
    await expect(()=> service.deleteAirportFromAirline("0", airport.id)).rejects.toHaveProperty("message", airlineNotFoundMessage);
  });

  it('deleteAirportToAirline should thrown an exception for an non asocciated airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.random.alphaNumeric(),
      country: faker.address.country(),
      city: faker.address.city()
    });
 
    await expect(()=> service.deleteAirportFromAirline(airline.id, newAirport.id)).rejects.toHaveProperty("message", airportNotAssociateAirlineMsg);
  });

});
