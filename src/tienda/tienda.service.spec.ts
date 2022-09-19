import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TiendaEntity } from './tienda.entity';
import { TiendaService } from './tienda.service';

describe('TiendaService', () => {
  let service: TiendaService;
  let repository: Repository<TiendaEntity>;
  let tiendasList = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaService],
    }).compile();

    service = module.get<TiendaService>(TiendaService);
    repository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    tiendasList = [];
    repository.clear();
    for(let i = 0; i < 5; i++){
        const tienda: TiendaEntity = await repository.save({
        name: faker.company.name(),
        city: faker.address.city(),
        address: faker.address.secondaryAddress()})
        tiendasList.push(tienda);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaService],
    }).compile();
 
    service = module.get<TiendaService>(TiendaService);
    repository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));
   await seedDatabase();
  });

  it('findAll debera retornar todas las tiendas', async () => {
    const tiendas: TiendaEntity[] = await service.findAll();
    expect(tiendas).not.toBeNull();
    expect(tiendas).toHaveLength(tiendasList.length);
  });

  it('findOne debera retornar una tienda por su id', async () => {
    const storedTienda: TiendaEntity = tiendasList[0];
    const tienda: TiendaEntity = await service.findOne(storedTienda.id);
    expect(tienda).not.toBeNull();
    expect(tienda.name).toEqual(storedTienda.name)
    expect(tienda.address).toEqual(storedTienda.address)
    expect(tienda.city).toEqual(storedTienda.city)
  });

  it('findOne debera lanzar una excepcion si la tienda es invalida', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "La tienda con ese ID no existe")
  });

  it('create debera retornar una nueva tienda', async () => {
    const tienda: TiendaEntity = {
      id: "",
      name: faker.company.name(),
      address: faker.address.secondaryAddress(),
      city: faker.address.city(),
      productos: []
    }
 
    const newTienda: TiendaEntity = await service.create(tienda);
    expect(newTienda).not.toBeNull();
 
    const storedTienda: TiendaEntity = await repository.findOne({where: {id: newTienda.id}})
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.name).toEqual(newTienda.name)
    expect(storedTienda.address).toEqual(newTienda.address)
    expect(storedTienda.city).toEqual(newTienda.city)
  });

  it('update debera modificar una tienda', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    tienda.name = "Nuevo Nombre";
    tienda.address = "Nueva Direccion";
     const updatedTienda: TiendaEntity = await service.update(tienda.id, tienda);
    expect(updatedTienda).not.toBeNull();
     const storedTienda: TiendaEntity = await repository.findOne({ where: { id: tienda.id } })
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.name).toEqual(tienda.name)
    expect(storedTienda.address).toEqual(tienda.address)
  });

  it('update debera lanzar una excepcion si la tienda es invalida', async () => {
    let tienda: TiendaEntity = tiendasList[0];
    tienda = {
      ...tienda, name: "Nuevo Nombre", address: "Nueva Direccion"
    }
    await expect(() => service.update("0", tienda)).rejects.toHaveProperty("message", "La tienda con ese ID no existe")
  });

  it('delete debera remover una tienda', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await service.delete(tienda.id);
     const deletedTienda: TiendaEntity = await repository.findOne({ where: { id: tienda.id } })
    expect(deletedTienda).toBeNull();
  });

  it('delete debera lanzar una excepcion si la tienda no existe', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await service.delete(tienda.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "La tienda con ese ID no existe")
  });
});
