import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';

describe('AerolineaAeropuertoService', () => {
  let service: AerolineaAeropuertoService;
  let aerolineaRepository: Repository<AerolineaEntity>;
  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aeropuerto: AeropuertoEntity;
  let aerolineaList : AerolineaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaAeropuertoService],
    }).compile();

    service = module.get<AerolineaAeropuertoService>(AerolineaAeropuertoService);
    aerolineaRepository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    aeropuertoRepository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    aerolineaRepository.clear();
    aeropuertoRepository.clear();

    aerolineaList = [];
    for (let i = 0; i < 3; i++) {
      const aerolinea: AerolineaEntity = await aerolineaRepository.save({
        id: "PRUEBA" + i,
        nombre: faker.company.companySuffix(), 
        descripcion: faker.lorem.sentence(),  
        fecha:faker.date.past()+"",      
        web: faker.lorem.sentence()
      })
      aerolineaList.push(aerolinea);
    }

    aeropuerto = await aeropuertoRepository.save({
      id: "PRUEBA5",
      nombre: faker.company.companySuffix(),
      pais: faker.lorem.sentence(),
      ciudad: faker.lorem.sentence(),      
      aerolineas: []
    })
  }
/*
  it('addAerolineaAeropuerto should add a aerolinea to a Aeropuerto', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      id: "TEST-Prueba09" ,
      nombre: faker.company.companySuffix(),
      pais: faker.lorem.sentence(),
      ciudad: faker.lorem.sentence(),      
    });

    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      id: "PRUEBA1",
      nombre: faker.company.companySuffix(), 
      descripcion: faker.lorem.sentence(),  
      fecha:faker.date.past()+"",      
      web: faker.lorem.sentence(),
      aeropuertos: []
    })

    const result: AeropuertoEntity = await service.addAirportToAirline( newAeropuerto.id,newAerolinea.id);

    expect(result.aerolineas.length).toBe(1);
    expect(result.aerolineas[0]).not.toBeNull();
    expect(result.aerolineas[0].id).toBe(newAerolinea.id)
    expect(result.aerolineas[0].nombre).toBe(newAerolinea.nombre)
    expect(result.aerolineas[0].descripcion).toBe(newAerolinea.descripcion)
    expect(result.aerolineas[0].fecha).toStrictEqual(newAerolinea.fecha)
    expect(result.aerolineas[0].web).toStrictEqual(newAerolinea.web)
  });
*/
  it('addAeropuertoAerolinea should thrown exception for an invalid Aeropuerto', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      id: "PRUEBA TEST 9077",
      nombre: faker.company.companySuffix(),
      pais: faker.lorem.sentence(),
      ciudad: faker.lorem.sentence(),  
      aerolineas: []
    })
    await expect(() => service.addAirportToAirline(newAeropuerto.id, "0")).rejects.toHaveProperty("message", "The aeropuerto with the given id was not found");
  });

  it('addAeropuertoAerolinea should thrown exception for an invalid aerolinea', async () => {
    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      id: faker.lorem.word(),
      nombre: faker.company.companySuffix(), 
      descripcion: faker.lorem.sentence(),  
      fecha:faker.date.past()+"",      
      web: faker.lorem.sentence()
    });

    await expect(() => service.addAirportToAirline("0", newAerolinea.id)).rejects.toHaveProperty("message", "The aeropuerto with the given id was not found");
  });

  it('findaddAeropuertoAerolineaId should throw an exception for an invalid aerolinea', async () => {
    const aeropuerto: AerolineaEntity = aerolineaList[0]; 
    await expect(()=> service.findAirportFromAirline(aeropuerto.id)).rejects.toHaveProperty("message", "The aeropuerto with the given id was not found"); 
  });

});
