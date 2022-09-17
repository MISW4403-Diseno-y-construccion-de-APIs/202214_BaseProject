import { Test, TestingModule } from '@nestjs/testing';
import { AirportService } from './airport.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AirportEntity } from './airport.entity';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('AirportService', () => {
  let service: AirportService;
  let repository: Repository<AirportEntity>;
  let airportList: AirportEntity[];
  const airportNotFoundMessage: string = 
  'The airport with the given id was not found';

  const seedDatabase = async () => {
    repository.clear();
    airportList = [];
    for(let i = 0; i < 5; i++){
      const airport: AirportEntity = await repository.save({
        name: faker.company.name(),
        code: faker.random.alphaNumeric(3),
        country: faker.address.country(),
        city: faker.address.city()
      })
      airportList.push(airport);
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirportService],
    }).compile();

    service = module.get<AirportService>(AirportService);
    repository = module.get<Repository<AirportEntity>>(getRepositoryToken(AirportEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airports', async () => {
    const airports: AirportEntity[] = await service.findAll();
    expect(airports).not.toBeNull();
    expect(airports).toHaveLength(airportList.length);
  });

  it('findOne should return a airport by id', async () => {
    const stored: AirportEntity = airportList[0];
    const airport: AirportEntity = await service.findOne(stored.id);
    expect(airport).not.toBeNull();
    expect(airport.name).toEqual(stored.name)
    expect(airport.code).toEqual(stored.code)
    expect(airport.city).toEqual(stored.city)
    expect(airport.country).toEqual(stored.country)
  });

  it('findOne should throw an exception for an invalid airport', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", airportNotFoundMessage)
  });

  it('create should return a new airport', async () => {
    const airport: AirportEntity = {
      id: "",
      name: faker.company.name(),
      code: faker.random.alphaNumeric(3),
      country: faker.address.country(),
      city: faker.address.city(),
      airlines: []
    }
 
    const newAeropuerto: AirportEntity = await service.create(airport);
    expect(newAeropuerto).not.toBeNull();

    const storedAerolinea: AirportEntity = await service.findOne(newAeropuerto.id)
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.name).toEqual(newAeropuerto.name)
    expect(storedAerolinea.code).toEqual(newAeropuerto.code)
    expect(storedAerolinea.city).toEqual(newAeropuerto.city)
    expect(storedAerolinea.country).toEqual(newAeropuerto.country)
 
  });

  it('create should throw an exception for an invalid airport code', async () => {
    const airport: AirportEntity = {
      id: "",
      name: faker.company.name(),
      code: faker.random.alphaNumeric(5),
      country: faker.address.country(),
      city: faker.address.city(),
      airlines: []
    }
 
    await expect(() => service.create(airport)).rejects.toHaveProperty("message", "Airport code should has 3 characters")
 
  });

  it('update should modify an airport', async () => {
    const airport: AirportEntity = airportList[0];
    airport.name = "New name";
    airport.city = "New city";
    const updated: AirportEntity = await service.update(airport.id, airport);
    expect(updated).not.toBeNull();
    const stored: AirportEntity = await repository.findOne({ where: { id: airport.id } })
    expect(stored).not.toBeNull();
    expect(stored.name).toEqual(airport.name)
    expect(stored.city).toEqual(airport.city)
  });

  it('update should throw an exception for an invalid airport code', async () => {
    let airport: AirportEntity = airportList[0];
    airport = {
      ...airport, code: faker.random.alphaNumeric(5)
    }
    await expect(() => service.update(airport.id, airport)).rejects.toHaveProperty("message", "Airport code should has 3 characters")
  });

  it('update should throw an exception for an invalid airport', async () => {
    let airport: AirportEntity = airportList[0];
    airport = {
      ...airport, name: "New name", city: "New city"
    }
    await expect(() => service.update("0", airport)).rejects.toHaveProperty("message", airportNotFoundMessage)
  });

  it('delete should remove an airport', async () => {
    const airport: AirportEntity = airportList[0];
    await service.delete(airport.id);
     const deleted: AirportEntity = await repository.findOne({ where: { id: airport.id } })
    expect(deleted).toBeNull();
  });

  it('delete should throw an exception for an invalid airport', async () => {
    const airport: AirportEntity = airportList[0];
    await service.delete(airport.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", airportNotFoundMessage)
  });

});
