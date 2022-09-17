import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { Repository } from 'typeorm';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('AerolineaAeropuertoService', () => {
  let service: AerolineaAeropuertoService;
  let aerolineaRepository: Repository<AerolineaEntity>;
  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aerolinea: AerolineaEntity;
  let aeropuertosList : AeropuertoEntity[];

  const aeropuertoNotFoundMessage: string =
    'El aeropuerto con el id dado no fue encontrado';

  const aerolineaNotFoundMessage: string =
    'La aerolinea con el id dado no fue encontrada';

  const aeropuertoNotAssociateAerolineaMsg: string = 
    "El aeropuerto con el id dado no esta asociado a la aerolinea";

  const seedDatabase = async () => {
    aeropuertoRepository.clear();
    aerolineaRepository.clear();
 
    aeropuertosList = [];
    for(let i = 0; i < 5; i++){
        const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
          nombre: faker.company.name(),
          codigo: faker.random.alphaNumeric(),
          pais: faker.address.country(),
          ciudad: faker.address.city()
        })
        aeropuertosList.push(aeropuerto);
    }
 
    aerolinea = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.past(),
      paginaWeb: faker.internet.url(),
      aeropuertos: aeropuertosList
    })
  }

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

  it('addAeropuertoAerolinea => deberia agregar un aeropuerto a una aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.random.alphaNumeric(),
      pais: faker.address.country(),
      ciudad: faker.address.city()
    });
 
    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.past(),
      paginaWeb: faker.internet.url()
    })
 
    const result: AerolineaEntity = await service.addAeropuertoAerolinea(newAerolinea.id, newAeropuerto.id);
   
    expect(result.aeropuertos.length).toBe(1);
    expect(result.aeropuertos[0]).not.toBeNull();
    expect(result.aeropuertos[0].nombre).toBe(newAeropuerto.nombre)
    expect(result.aeropuertos[0].ciudad).toBe(newAeropuerto.ciudad)
    expect(result.aeropuertos[0].pais).toBe(newAeropuerto.pais)
    expect(result.aeropuertos[0].codigo).toBe(newAeropuerto.codigo)
  });

  it('addAeropuertoAerolinea => deberia lanzar una excepciòn para un aeropuerto invalido', async () => {
    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.past(),
      paginaWeb: faker.internet.url()
    })
 
    await expect(() => service.addAeropuertoAerolinea(newAerolinea.id, "0")).rejects.toHaveProperty("message", aeropuertoNotFoundMessage);
  });

  it('addAeropuertoAerolinea => deberia lanzar una excepciòn para una aerolinea no valida', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.random.alphaNumeric(),
      pais: faker.address.country(),
      ciudad: faker.address.city()
    });
 
    await expect(() => service.addAeropuertoAerolinea("0", newAeropuerto.id)).rejects.toHaveProperty("message", aerolineaNotFoundMessage);
  });

  it('findAeropuertoByAerolineaIdAeropuertoId => deberia devolver aeropuerto por aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    const storedAeropuerto: AeropuertoEntity = await service.findAeropuertoByAerolineaIdAeropuertoId(aerolinea.id, aeropuerto.id, )
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toBe(aeropuerto.nombre);
    expect(storedAeropuerto.ciudad).toBe(aeropuerto.ciudad);
    expect(storedAeropuerto.pais).toBe(aeropuerto.pais);
    expect(storedAeropuerto.codigo).toBe(aeropuerto.codigo);
  });

  it('findAeropuertoByAerolineaIdAeropuertoId => deberia lanzar una excepciòn para un aeropuerto invalido', async () => {
    await expect(()=> service.findAeropuertoByAerolineaIdAeropuertoId(aerolinea.id, "0")).rejects.toHaveProperty("message", aeropuertoNotFoundMessage);
  });

  it('findAeropuertoByAerolineaIdAeropuertoId => deberia lanzar una excepciòn para una aerolinea invalida', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await expect(()=> service.findAeropuertoByAerolineaIdAeropuertoId("0", aeropuerto.id)).rejects.toHaveProperty("message", aerolineaNotFoundMessage);
  });

  it('findAeropuertoByAerolineaIdAeropuertoId => deberia lanzar una excepciòn si el aeropuerto no esta asociado con la aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.random.alphaNumeric(),
      pais: faker.address.country(),
      ciudad: faker.address.city()
    });
 
    await expect(()=> service.findAeropuertoByAerolineaIdAeropuertoId(aerolinea.id, newAeropuerto.id)).rejects.toHaveProperty("message", aeropuertoNotAssociateAerolineaMsg);
  });

  it('findAeropuertosByAerolineaId =>  deberia devolver los aeropuertos por aerolinea', async ()=>{
    const aeropuertos: AeropuertoEntity[] = await service.findAeropuertosByAerolineaId(aerolinea.id);
    expect(aeropuertos.length).toBe(5)
  });

  it('findAeropuertosByAerolineaId => deberia lanzar una excepciòn para una aerolinea invalida', async () => {
    await expect(()=> service.findAeropuertosByAerolineaId("0")).rejects.toHaveProperty("message", aerolineaNotFoundMessage);
  });

  it('associateAeropuertosAerolinea => deberia actualizar la lista de aeropuertos por aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.random.alphaNumeric(),
      pais: faker.address.country(),
      ciudad: faker.address.city()
    });
 
    const updatedAerolinea: AerolineaEntity = await service.associateAeropuertosAerolinea(aerolinea.id, [newAeropuerto]);
    expect(updatedAerolinea.aeropuertos.length).toBe(1);
 
    expect(updatedAerolinea.aeropuertos[0].nombre).toBe(newAeropuerto.nombre);
    expect(updatedAerolinea.aeropuertos[0].ciudad).toBe(newAeropuerto.ciudad);
    expect(updatedAerolinea.aeropuertos[0].pais).toBe(newAeropuerto.pais);
    expect(updatedAerolinea.aeropuertos[0].codigo).toBe(newAeropuerto.codigo);
   
  });

  it('associateAeropuertosAerolinea => deberia lanzar una excepciòn para una aerolinea invalida', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.random.alphaNumeric(),
      pais: faker.address.country(),
      ciudad: faker.address.city()
    });
 
    await expect(()=> service.associateAeropuertosAerolinea("0", [newAeropuerto])).rejects.toHaveProperty("message", aerolineaNotFoundMessage);
  });

  it('associateAeropuertosAerolinea => deberia lanzar una excepciòn para un aeropuerto invalido', async () => {
    const newAeropuerto: AeropuertoEntity = aeropuertosList[0];
    newAeropuerto.id = "0";
 
    await expect(()=> service.associateAeropuertosAerolinea(aerolinea.id, [newAeropuerto])).rejects.toHaveProperty("message", aeropuertoNotFoundMessage);
  });

  it('deleteAeropuertoToAerolinea => deberia eliminar un aeropuerto de la aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
   
    await service.deleteAeropuertoAerolinea(aerolinea.id, aeropuerto.id);
 
    const storedAerolinea: AerolineaEntity = await aerolineaRepository.findOne({where: {id: aerolinea.id}, relations: ["aeropuertos"]});
    const deletedAeropuerto: AeropuertoEntity = storedAerolinea.aeropuertos.find(a => a.id === aeropuerto.id);
 
    expect(deletedAeropuerto).toBeUndefined();
 
  });

  it('deleteAeropuertoToAerolinea => deberia lanzar una excepciòn para un aeropuerto invalido', async () => {
    await expect(()=> service.deleteAeropuertoAerolinea(aerolinea.id, "0")).rejects.toHaveProperty("message", aeropuertoNotFoundMessage);
  });

  it('deleteAeropuertoToAerolinea => deberia lanzar una excepciòn para un aerolinea invalida', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await expect(()=> service.deleteAeropuertoAerolinea("0", aeropuerto.id)).rejects.toHaveProperty("message", aerolineaNotFoundMessage);
  });

  it('deleteAeropuertoToAerolinea => deberia lanzar una excepciòn si un aeropuerto no esta asociada con la aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.random.alphaNumeric(),
      pais: faker.address.country(),
      ciudad: faker.address.city()
    });
 
    await expect(()=> service.deleteAeropuertoAerolinea(aerolinea.id, newAeropuerto.id)).rejects.toHaveProperty("message", aeropuertoNotAssociateAerolineaMsg);
  });

});
