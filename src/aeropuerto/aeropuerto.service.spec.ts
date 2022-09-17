import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoService } from './aeropuerto.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AeropuertoEntity } from './aeropuerto.entity';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let repository: Repository<AeropuertoEntity>;
  let aeropuertoList: AeropuertoEntity[];
  const aeropuertoNotFoundMessage: string = 'El aeropuerto con el id dado no fue encontrado';

  const seedDatabase = async () => {
    repository.clear();
    aeropuertoList = [];
    for(let i = 0; i < 5; i++){
      const aeropuerto: AeropuertoEntity = await repository.save({
        nombre: faker.company.name(),
        codigo: faker.random.alphaNumeric(),
        pais: faker.address.country(),
        ciudad: faker.address.city()
      })
      aeropuertoList.push(aeropuerto);
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoService],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
    repository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll => deberia devolver todas los aeropuertos', async () => {
    const aeropuertos: AeropuertoEntity[] = await service.findAll();
    expect(aeropuertos).not.toBeNull();
    expect(aeropuertos).toHaveLength(aeropuertoList.length);
  });

  it('findOne => deberia devolder un aeropuerto por id', async () => {
    const stored: AeropuertoEntity = aeropuertoList[0];
    const aeropuerto: AeropuertoEntity = await service.findOne(stored.id);
    expect(aeropuerto).not.toBeNull();
    expect(aeropuerto.nombre).toEqual(stored.nombre)
    expect(aeropuerto.codigo).toEqual(stored.codigo)
    expect(aeropuerto.ciudad).toEqual(stored.ciudad)
    expect(aeropuerto.pais).toEqual(stored.pais)
  });

  it('findOne => debería lanzar una excepción para un aeropuerto inválido', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", aeropuertoNotFoundMessage)
  });

  it('create = > deberia devolver un nuevo aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = {
      id: "",
      nombre: faker.company.name(),
      codigo: faker.random.alphaNumeric(),
      pais: faker.address.country(),
      ciudad: faker.address.city(),
      aerolineas: []
    }
 
    const newAeropuerto: AeropuertoEntity = await service.create(aeropuerto);
    expect(newAeropuerto).not.toBeNull();

    const storedAerolinea: AeropuertoEntity = await service.findOne(newAeropuerto.id)
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.nombre).toEqual(newAeropuerto.nombre)
    expect(storedAerolinea.codigo).toEqual(newAeropuerto.codigo)
    expect(storedAerolinea.ciudad).toEqual(newAeropuerto.ciudad)
    expect(storedAerolinea.pais).toEqual(newAeropuerto.pais)
 
  });

  it('update => deberia modificar un aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];
    aeropuerto.nombre = "Nuevo nombre";
    aeropuerto.ciudad = "Nueva ciudad";
    const updated: AeropuertoEntity = await service.update(aeropuerto.id, aeropuerto);
    expect(updated).not.toBeNull();
    const stored: AeropuertoEntity = await repository.findOne({ where: { id: aeropuerto.id } })
    expect(stored).not.toBeNull();
    expect(stored.nombre).toEqual(aeropuerto.nombre)
    expect(stored.ciudad).toEqual(aeropuerto.ciudad)
  });

  it('update =>  debería lanzar una excepción para un aeropuerto invalido', async () => {
    let aeropuerto: AeropuertoEntity = aeropuertoList[0];
    aeropuerto = {
      ...aeropuerto, nombre: "Nuevo nombre", ciudad: "Nueva ciudad"
    }
    await expect(() => service.update("0", aeropuerto)).rejects.toHaveProperty("message", aeropuertoNotFoundMessage)
  });

  it('delete => deberia eliminar un aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];
    await service.delete(aeropuerto.id);
     const deleted: AeropuertoEntity = await repository.findOne({ where: { id: aeropuerto.id } })
    expect(deleted).toBeNull();
  });

  it('delete =>  debería lanzar una excepción para un aeropuerto invalido', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];
    await service.delete(aeropuerto.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", aeropuertoNotFoundMessage)
  });

});
