import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaService } from './aerolinea.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AerolineaEntity } from './aerolinea.entity';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('AerolineaService', () => {
  let service: AerolineaService;
  let repository: Repository<AerolineaEntity>;
  let aerolineaList: AerolineaEntity[];
  const aerolineaNotFoundMessage: string = 'La aerolinea con el id dado no fue encontrada';

  const seedDatabase = async () => {
    repository.clear();
    aerolineaList = [];
    for(let i = 0; i < 5; i++){
      const aerolinea: AerolineaEntity = await repository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        fechaFundacion: faker.date.past(),
        paginaWeb: faker.internet.url()
      })
      aerolineaList.push(aerolinea);
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaService],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
    repository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll => deberia devolver todas las aerolineas', async () => {
    const aerolineas: AerolineaEntity[] = await service.findAll();
    expect(aerolineas).not.toBeNull();
    expect(aerolineas).toHaveLength(aerolineaList.length);
  });

  it('findOne => deberia devolder una aerolinea por id', async () => {
    const stored: AerolineaEntity = aerolineaList[0];
    const aerolinea: AerolineaEntity = await service.findOne(stored.id);
    expect(aerolinea).not.toBeNull();
    expect(aerolinea.nombre).toEqual(stored.nombre)
    expect(aerolinea.descripcion).toEqual(stored.descripcion)
    expect(aerolinea.fechaFundacion).toEqual(stored.fechaFundacion)
    expect(aerolinea.paginaWeb).toEqual(stored.paginaWeb)
  });

  it('findOne => debería lanzar una excepción para una aerolinea inválida', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", aerolineaNotFoundMessage)
  });

  it('create = > deberia devolver una nueva aerolinea', async () => {
    const aerolinea: AerolineaEntity = {
      id: "",
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.past(),
      paginaWeb: faker.internet.url(),
      aeropuertos: []
    }
 
    const newAerolinea: AerolineaEntity = await service.create(aerolinea);
    expect(newAerolinea).not.toBeNull();

    const storedAerolinea: AerolineaEntity = await service.findOne(newAerolinea.id)
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.nombre).toEqual(newAerolinea.nombre)
    expect(storedAerolinea.descripcion).toEqual(newAerolinea.descripcion)
    expect(storedAerolinea.fechaFundacion).toEqual(newAerolinea.fechaFundacion)
    expect(storedAerolinea.paginaWeb).toEqual(newAerolinea.paginaWeb)
 
  });

  it('update => deberia modificar una aerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineaList[0];
    aerolinea.nombre = "Nuevo nombre";
    aerolinea.descripcion = "Nueva descripcion";
    const updated: AerolineaEntity = await service.update(aerolinea.id, aerolinea);
    expect(updated).not.toBeNull();
    const stored: AerolineaEntity = await repository.findOne({ where: { id: aerolinea.id } })
    expect(stored).not.toBeNull();
    expect(stored.nombre).toEqual(aerolinea.nombre)
    expect(stored.descripcion).toEqual(aerolinea.descripcion)
  });

  it('update =>  debería lanzar una excepción para una aerolinea invalida', async () => {
    let aerolinea: AerolineaEntity = aerolineaList[0];
    aerolinea = {
      ...aerolinea, nombre: "Nuevo nombre", descripcion: "Nueva descripcion"
    }
    await expect(() => service.update("0", aerolinea)).rejects.toHaveProperty("message", aerolineaNotFoundMessage)
  });

  it('delete => deberia eliminar una aerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineaList[0];
    await service.delete(aerolinea.id);
     const deleted: AerolineaEntity = await repository.findOne({ where: { id: aerolinea.id } })
    expect(deleted).toBeNull();
  });

  it('delete =>  debería lanzar una excepción para una aerolinea invalida', async () => {
    const aerolinea: AerolineaEntity = aerolineaList[0];
    await service.delete(aerolinea.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", aerolineaNotFoundMessage)
  });


});
