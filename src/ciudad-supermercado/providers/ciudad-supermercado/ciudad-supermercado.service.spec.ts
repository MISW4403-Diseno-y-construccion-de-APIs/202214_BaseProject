import { Test, TestingModule } from '@nestjs/testing';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { TypeOrmTestingConfig } from '../../../shared/testing-utils/typeorm-testing-config';
import { CiudadEntity } from '../../../ciudad/entities/ciudad.entity';
import { SupermercadoEntity } from '../../../supermercado/entities/supermercado.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken} from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('CiudadSupermercadoService', () => {
  let service: CiudadSupermercadoService;
  let ciudadRepository: Repository<CiudadEntity>;
  let supermercadoRepository: Repository<SupermercadoEntity>;
  
  let listadoCiudades : CiudadEntity[];
  let listadoSupermercados : SupermercadoEntity[];

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
    ciudadRepository.clear();
    supermercadoRepository.clear();

    listadoCiudades = [];
    for(let i = 0; i < 5; i++){
      const ciudad: CiudadEntity = await ciudadRepository.save({
        id: faker.datatype.uuid(),
        nombre: faker.name.firstName(),
        habitantes: faker.datatype.number({'min': 10, 'max': 50}),
        pais: 'Argentina'
      })
      listadoCiudades.push(ciudad);
    }

    listadoSupermercados = [];
    for(let i = 0; i < 5; i++){
      const supermercado: SupermercadoEntity = await supermercadoRepository.save({
        id: faker.datatype.uuid(),
        nombre: faker.name.firstName(),
        longitud: faker.address.latitude(),
        latitud: faker.address.latitude(),
        pagina: faker.internet.url(),
        ciudades: listadoCiudades
      });
      listadoSupermercados.push(supermercado);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addSupermarketToCity debería agregar un supermercado  a una ciudad', async () => {
    
    const ciudad: CiudadEntity = await ciudadRepository.save({
      id: faker.datatype.uuid(),
      nombre: faker.name.firstName(),
      habitantes: faker.datatype.number({'min': 10, 'max': 50}),
      pais: 'Argentina'
    })

    const supermercado: SupermercadoEntity = await supermercadoRepository.save({
      id: faker.datatype.uuid(),
      nombre: faker.name.firstName(),
      longitud: faker.address.latitude(),
      latitud: faker.address.latitude(),
      pagina: faker.internet.url(),
      ciudades:[]
    })

    const result: CiudadEntity = await service.addSupermarketToCity(supermercado.id, ciudad.id);
    expect(result.supermercados.length).toBe(1);
    expect(result.supermercados[0]).not.toBeNull();
    expect(result.supermercados[0].nombre).toBe(supermercado.nombre)
    expect(result.supermercados[0].pagina).toBe(supermercado.pagina)
  });

  it('addSupermarketToCity debería lanzar una excepción para una ciudad no válida', async () => {
    const ciudad: CiudadEntity = await ciudadRepository.save({
      id: faker.datatype.uuid(),
      nombre: faker.name.firstName(),
      habitantes: faker.datatype.number({'min': 10, 'max': 50}),
      pais: 'Argentina'
    })

    const supermercado: SupermercadoEntity = await supermercadoRepository.save({
      id: faker.datatype.uuid(),
      nombre: faker.company.name(),
      longitud: faker.address.latitude(),
      latitud: faker.address.latitude(),
      pagina: faker.internet.url(),
      ciudades:[]
    })

    await expect(() => service.addSupermarketToCity(supermercado.id, "0")).rejects.toHaveProperty("message", "No se encontró la ciudad con la identificación proporcionada.");
  });

  it('addSupermarketToCity debería lanzar una excepción para un supermercado no válido', async () => {
    const ciudad: CiudadEntity = await ciudadRepository.save({
      id: faker.datatype.uuid(),
      nombre: faker.name.firstName(),
      habitantes: faker.datatype.number({'min': 10, 'max': 50}),
      pais: 'Argentina'
    });

    await expect(() => service.addSupermarketToCity("0", ciudad.id)).rejects.toHaveProperty("message", "No se encontró el supermercado con la identificación proporcionada.");
  });

  it('findSupermarketsFromCity debería retornar supermercado por ciudad', async () => {
    const supermercado: SupermercadoEntity = listadoSupermercados[0];
    const supermercadoAlmacenado: SupermercadoEntity = await service.findSupermarketFromCity(supermercado.id, listadoCiudades[0].id)
    expect(supermercadoAlmacenado).not.toBeNull();
    expect(supermercadoAlmacenado.nombre).toBe(supermercado.nombre);
    expect(supermercadoAlmacenado.pagina).toBe(supermercado.pagina);
  });

  it('findSupermarketsFromCity, supermercado no existe,  debería retornar supermercado por ciudad', async () => {
    const supermercado: SupermercadoEntity = listadoSupermercados[0];
    await expect(() =>  service.findSupermarketFromCity("0", listadoCiudades[0].id)).rejects.toHaveProperty("message", "No se encontró el supermercado con la identificación proporcionada.");
  });

  it('findSupermarketsFromCity debe retornar el listado de supermercados por ciudad', async () => {
    const result: SupermercadoEntity[] = await service.findSupermarketsFromCity(listadoCiudades[0].id);
    expect(result.length).toBe(5);
  });
  
  it('updateSupermarketsFromCity debe actualizar un supermercado que pertenecea una ciudad', async () => {
    const supermercado: SupermercadoEntity = listadoSupermercados[0];
    supermercado.nombre = faker.company.name();
    const supermercadoAlmacenado: SupermercadoEntity = await service.updateSupermarketsFromCity(supermercado.id, supermercado.ciudades[0].id, supermercado)

    expect(supermercadoAlmacenado).not.toBeNull();
    expect(supermercadoAlmacenado.nombre).toBe(supermercado.nombre);
  });

  it('updateSupermarketsFromCity, supermercado no existe, debe actualizar un supermercado que pertenecea una ciudad', async () => {
    const supermercado: SupermercadoEntity = listadoSupermercados[0];
    supermercado.nombre = faker.company.name();
    await expect(() =>  service.updateSupermarketsFromCity("0", supermercado.ciudades[0].id, supermercado)).rejects.toHaveProperty("message", "El supermercado no se encuentra asociado a la ciudad.");

  });

  it('deleteSupermarketFromCity, supermercado no existe, debería eliminar el supermercado que tiene una ciudad', async () => {
    const supermercado: SupermercadoEntity = listadoSupermercados[0];
    await expect(() => service.deleteSupermarketFromCity('0', supermercado.ciudades[0].id)).rejects.toHaveProperty("message", "No se encontró el supermercado con la identificación proporcionada.");
  });

  it('deleteSupermarketFromCity debería eliminar el supermercado que tiene una ciudad', async () => {
    const supermercado: SupermercadoEntity = listadoSupermercados[0];
    await service.deleteSupermarketFromCity(supermercado.id, supermercado.ciudades[0].id);
    await expect(() => service.findSupermarketFromCity(supermercado.id, listadoCiudades[0].id)).rejects.toHaveProperty("message", "No se encontró el supermercado con la identificación proporcionada.");
  });
});
