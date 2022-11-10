import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SupermercadoEntity } from './supermercado.entity';
import { SupermercadoService } from './supermercado.service';
import { faker } from '@faker-js/faker';

describe('SupermercadoService', () => {
 let service: SupermercadoService;
 let repository: Repository<SupermercadoEntity>;
 let supermercadoList: SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService],
    }).compile();

    service = module.get<SupermercadoService>(SupermercadoService);
    repository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    supermercadoList = [];
    for(let i = 0; i < 5; i++){
        const supermercado: SupermercadoEntity = await repository.save({
          latitud: faker.address.latitude.toString(),
          longitud: faker.address.longitude.toString(),
          nombre: faker.company.name(),
          paginaWeb: faker.internet.url()
        })
        supermercadoList.push(supermercado);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all supermarkets', async () => {
    const supermarkets: SupermercadoEntity[] = await service.findAll();
    expect(supermarkets).not.toBeNull();
    expect(supermarkets).toHaveLength(supermercadoList.length); 
  });

  it('findOne should return a supermarket by id', async () => {
    const storedSupermarket: SupermercadoEntity = supermercadoList[0];
    const supermarket: SupermercadoEntity = await service.findOne(storedSupermarket.id);
    expect(supermarket).not.toBeNull();
    expect(supermarket.nombre).toEqual(storedSupermarket.nombre)
    expect(supermarket.latitud).toEqual(storedSupermarket.latitud)
    expect(supermarket.longitud).toEqual(storedSupermarket.longitud)
    expect(supermarket.paginaWeb).toEqual(storedSupermarket.paginaWeb)
  });

  it('findOne should throw an exception for an invalid supermarket', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El supermercado no fue encontrado")
  });

  it('create should return a new supermarket', async () => {
    const supermarket: SupermercadoEntity = {
      id: "",
      latitud: faker.address.latitude.toString(),
      longitud: faker.address.longitude.toString(),
      nombre: faker.company.name(),
      paginaWeb: faker.internet.url(),
      ciudades: []
    }

    const newSupermarket: SupermercadoEntity = await service.create(supermarket);
    expect(newSupermarket).not.toBeNull();

    const storedSupermarket: SupermercadoEntity = await repository.findOne({where: {id: newSupermarket.id}})
    expect(storedSupermarket).not.toBeNull();
    expect(storedSupermarket.nombre).toEqual(newSupermarket.nombre)
    expect(storedSupermarket.latitud).toEqual(newSupermarket.latitud)
    expect(storedSupermarket.longitud).toEqual(newSupermarket.longitud)
    expect(storedSupermarket.paginaWeb).toEqual(newSupermarket.paginaWeb)
  });

  it('update should modify a supermarket', async () => {
    const supermarket: SupermercadoEntity = supermercadoList[0];
    supermarket.nombre = "Nombre del supermercado";
  
    const updatedSupermarket: SupermercadoEntity = await service.update(supermarket.id, supermarket);
    expect(updatedSupermarket).not.toBeNull();
  
    const storedSupermarket: SupermercadoEntity = await repository.findOne({ where: { id: supermarket.id } })
    expect(storedSupermarket).not.toBeNull();
    expect(storedSupermarket.nombre).toEqual(supermarket.nombre) 
  });

  it('update should throw an exception for an invalid supermarket', async () => {
    let supermarket: SupermercadoEntity = supermercadoList[0];
    supermarket = {
      ...supermarket, nombre: "New name"
    }
    await expect(() => service.update("0", supermarket)).rejects.toHaveProperty("message", "El supermercado con el id dado no fue encontrado")
  });

  it('delete should remove a supermarket', async () => {
    const supermarket: SupermercadoEntity = supermercadoList[0];
    await service.delete(supermarket.id);
  
    const deletedSupermarket: SupermercadoEntity = await repository.findOne({ where: { id: supermarket.id } })
    expect(deletedSupermarket).toBeNull(); 
  });

  it('delete should throw an exception for an invalid supermarket', async () => {
    const supermarket: SupermercadoEntity = supermercadoList[0];
    await service.delete(supermarket.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El supermercado con el id dado no fue encontrado")
  });

});


