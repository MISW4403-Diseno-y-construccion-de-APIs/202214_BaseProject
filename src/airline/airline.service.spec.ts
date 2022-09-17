import { Test, TestingModule } from '@nestjs/testing';
import { AirlineService } from './airline.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AirlineEntity } from './airline.entity';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('AirlineService', () => {
  let service: AirlineService;
  let repository: Repository<AirlineEntity>;
  let airlineList: AirlineEntity[];
  const airlineNotFoundMessage: string = 
  'The airline with the given id was not found';

  const seedDatabase = async () => {
    repository.clear();
    airlineList = [];
    for(let i = 0; i < 5; i++){
      const airline: AirlineEntity = await repository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
        foundationDate: faker.date.past(),
        webPage: faker.internet.url()
      })
      airlineList.push(airline);
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineService],
    }).compile();

    service = module.get<AirlineService>(AirlineService);
    repository = module.get<Repository<AirlineEntity>>(getRepositoryToken(AirlineEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airlines', async () => {
    const airlines: AirlineEntity[] = await service.findAll();
    expect(airlines).not.toBeNull();
    expect(airlines).toHaveLength(airlineList.length);
  });

  it('findOne should return a museum by id', async () => {
    const stored: AirlineEntity = airlineList[0];
    const airline: AirlineEntity = await service.findOne(stored.id);
    expect(airline).not.toBeNull();
    expect(airline.name).toEqual(stored.name)
    expect(airline.description).toEqual(stored.description)
    expect(airline.foundationDate).toEqual(stored.foundationDate)
    expect(airline.webPage).toEqual(stored.webPage)
  });

  it('findOne should throw an exception for an invalid airline', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", airlineNotFoundMessage)
  });

  it('create should return a new airline', async () => {
    const airline: AirlineEntity = {
      id: "",
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      foundationDate: faker.date.past(),
      webPage: faker.internet.url(),
      airports: []
    }
 
    const newAerolinea: AirlineEntity = await service.create(airline);
    expect(newAerolinea).not.toBeNull();

    const storedAerolinea: AirlineEntity = await service.findOne(newAerolinea.id)
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.name).toEqual(newAerolinea.name)
    expect(storedAerolinea.description).toEqual(newAerolinea.description)
    expect(storedAerolinea.foundationDate).toEqual(newAerolinea.foundationDate)
    expect(storedAerolinea.webPage).toEqual(newAerolinea.webPage)
 
  });


  it('create should should throw an exception for an invalid foundation date', async () => {
    const airline: AirlineEntity = {
      id: "",
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      foundationDate: faker.date.future(),
      webPage: faker.internet.url(),
      airports: []
    }
 
    await expect(() => service.create(airline)).rejects.toHaveProperty("message", "Foundation date invalid. The foundation date should be before the current date")
    
  });


  it('update should modify an airline', async () => {
    const airline: AirlineEntity = airlineList[0];
    airline.name = "New name";
    airline.description = "New description";
    const updated: AirlineEntity = await service.update(airline.id, airline);
    expect(updated).not.toBeNull();
    const stored: AirlineEntity = await repository.findOne({ where: { id: airline.id } })
    expect(stored).not.toBeNull();
    expect(stored.name).toEqual(airline.name)
    expect(stored.description).toEqual(airline.description)
  });

  it('update should throw an exception for an invalid foundation date', async () => {
    const airline: AirlineEntity = airlineList[0];
    airline.foundationDate = faker.date.future()
     
    await expect(() => service.update(airline.id, airline)).rejects.toHaveProperty("message", "Foundation date invalid. The foundation date should be before the current date")
  });


  it('update should throw an exception for an invalid airline', async () => {
    let airline: AirlineEntity = airlineList[0];
    airline = {
      ...airline, name: "new name", description: "new description"
    }
    await expect(() => service.update("0", airline)).rejects.toHaveProperty("message", airlineNotFoundMessage)
  });

  it('delete should remove an airline', async () => {
    const airline: AirlineEntity = airlineList[0];
    await service.delete(airline.id);
     const deleted: AirlineEntity = await repository.findOne({ where: { id: airline.id } })
    expect(deleted).toBeNull();
  });

  it('delete should throw an exception for an invalid airline', async () => {
    const airline: AirlineEntity = airlineList[0];
    await service.delete(airline.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", airlineNotFoundMessage)
  });


});
