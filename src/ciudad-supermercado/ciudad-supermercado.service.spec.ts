import { Test, TestingModule } from '@nestjs/testing';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { Repository } from 'typeorm';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('MuseumArtworkService', () => {
  let service: CiudadSupermercadoService;
  let ciudadRepository: Repository<CiudadEntity>;
  let supermercadoRepository: Repository<SupermercadoEntity>;
  let supermercadoList : SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadSupermercadoService],
    }).compile();

    service = module.get<CiudadSupermercadoService>(CiudadSupermercadoService);
    ciudadRepository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    supermercadoRepository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    supermercadoRepository.clear();
    ciudadRepository.clear();


    for(let i = 0; i < 5; i++){
        const supermercado: SupermercadoEntity = await supermercadoRepository.save({
          latitud : faker.address.latitude(),
          longitud: faker.address.longitude(),
          nombre: "faker.address.cityName()",
          paginaWeb: faker.image.imageUrl()
        })
        supermercadoList.push(supermercado);
    }

  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addSupermarketToCity should add an artwork to a museum', async () => {
    const newSupermarket: SupermercadoEntity = await supermercadoRepository.save({
      latitud: faker.address.latitude.toString(),
      longitud: faker.address.longitude.toString(),
      nombre: faker.company.name(),
      paginaWeb: faker.internet.url(),
    });
    const nombrePais : string = "Argentina"
    const newCity: CiudadEntity = await ciudadRepository.save({
      nombre: faker.address.cityName(),
      numeroHabitantes: faker.datatype.number(),
      pais: nombrePais
    })

    const result: CiudadEntity = await service.addSupermarketToCity(newCity.id, newSupermarket.id);
    
    expect(result.supermercados.length).toBe(1);
    expect(result.supermercados[0]).not.toBeNull();
    expect(result.supermercados[0].nombre).toBe(newSupermarket.nombre)
    expect(result.supermercados[0].latitud).toBe(newSupermarket.latitud)
    expect(result.supermercados[0].longitud).toBe(newSupermarket.longitud)
    expect(result.supermercados[0].paginaWeb).toBe(newSupermarket.paginaWeb) 
  });

  it('addArtworkMuseum should thrown exception for an invalid artwork', async () => {
    const nombrePais : string = "Argentina"
    const newCity: CiudadEntity = await ciudadRepository.save({
      nombre: faker.address.cityName(),
      numeroHabitantes: faker.datatype.number(), 
      pais: nombrePais
    })

    await expect(() => service.addSupermarketToCity(newCity.id, "0")).rejects.toHaveProperty("message", "El supermercado no fue encontrado");
  });

  it('addArtworkMuseum should throw an exception for an invalid museum', async () => {
    const supermercado: SupermercadoEntity = await supermercadoRepository.save({
      latitud: faker.address.latitude.toString(),
      longitud: faker.address.longitude.toString(),
      nombre: faker.company.name(), 
      paginaWeb: faker.internet.url(),
    });

    await expect(() => service.addSupermarketToCity("0", supermercado.id)).rejects.toHaveProperty("message", "La ciudad con el id dado no fue encontrada");
  });

  

});