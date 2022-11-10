import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CiudadEntity } from './ciudad.entity';
import { CiudadService } from './ciudad.service';
import { faker } from '@faker-js/faker';

describe('CiudadService', () => {
 let service: CiudadService;
 let repository: Repository<CiudadEntity>;
 let ciudadList: CiudadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();

    service = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    ciudadList = [];
    for(let i = 0; i < 5; i++){
        const ciudad: CiudadEntity = await repository.save({
          nombre: faker.address.cityName(),
          numeroHabitantes: faker.datatype.number(),
          pais: faker.address.country()
        })
        ciudadList.push(ciudad);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all cities', async () => {
    const ciudades: CiudadEntity[] = await service.findAll();
    expect(ciudades).not.toBeNull();
    expect(ciudades).toHaveLength(ciudadList.length);
  });

  it('findOne should return a city by id', async () => {
    const storedCity: CiudadEntity = ciudadList[0];
    const city: CiudadEntity = await service.findOne(storedCity.id);
    expect(city).not.toBeNull();
    expect(city.nombre).toEqual(storedCity.nombre)
    expect(city.pais).toEqual(storedCity.pais)
    expect(city.numeroHabitantes).toEqual(storedCity.numeroHabitantes)
  });

  it('findOne should throw an exception for an invalid city', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "La ciudad no fue encontrada")
  });

  it('create should return a new city', async () => {
    const nombre: string = "Argentina"
    const city: CiudadEntity = {
      id: "",
      nombre: "faker.address.cityName()", 
      numeroHabitantes: faker.datatype.number(),
      pais: nombre,
      supermercados: []
    }

    const newCity: CiudadEntity = await service.create(city);
    expect(newCity).not.toBeNull();

    const storedCity: CiudadEntity = await repository.findOne({where: {id: newCity.id}})
    expect(storedCity).not.toBeNull();
    expect(storedCity.nombre).toEqual(newCity.nombre)
    expect(storedCity.numeroHabitantes).toEqual(newCity.numeroHabitantes)
    expect(storedCity.pais).toEqual(newCity.pais)
  });

  it('update should modify a city', async () => {
    const city: CiudadEntity = ciudadList[0];
    city.pais = "Ecuador";
  
    const updatedCity: CiudadEntity = await service.update(city.id, city);
    expect(updatedCity).not.toBeNull();
  
    const storedCity: CiudadEntity = await repository.findOne({ where: { id: city.id } })
    expect(storedCity).not.toBeNull();
    expect(storedCity.nombre).toEqual(city.nombre)
  });

  it('update should throw an exception for an invalid city', async () => {
    let city: CiudadEntity = ciudadList[0];
    city = {
      ...city, nombre: "New name", pais: "New address"
    }
    await expect(() => service.update("0", city)).rejects.toHaveProperty("message", "La ciudad con el id dado no fue encontrada")
  });

  it('delete should remove a city', async () => {
    const city: CiudadEntity = ciudadList[0];
    await service.delete(city.id);
  
    const deletedMuseum: CiudadEntity = await repository.findOne({ where: { id: city.id } })
    expect(deletedMuseum).toBeNull();
  });

  it('delete should throw an exception for an invalid city', async () => {
    const city: CiudadEntity = ciudadList[0];
    await service.delete(city.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "La ciudad con el id dado no fue encontrada")
  });

});


