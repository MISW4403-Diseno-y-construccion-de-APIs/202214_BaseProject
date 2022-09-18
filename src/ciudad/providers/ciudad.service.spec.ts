import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../../shared/testing-utils/typeorm-testing-config';
import { CiudadEntity } from '../entities/ciudad.entity';
import { CiudadService } from './ciudad.service';
import { getRepositoryToken} from '@nestjs/typeorm';

import { faker } from '@faker-js/faker';

describe('CiudadService', () => {
  let provider: CiudadService;
  let repository: Repository<CiudadEntity>;
  let listadoCiudades: CiudadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();

    provider = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    listadoCiudades = [];

    for(let i = 0; i < 5; i++){
        const ciudad: CiudadEntity = await repository.save({
          id: faker.datatype.uuid(),
          nombre: faker.name.firstName(),
          habitantes: faker.datatype.number({'min': 10, 'max': 50}),
          pais: 'Argentina'
        })
        listadoCiudades.push(ciudad);
    }
  }

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('Retornar todas las ciudades', async () => {
    const ciudades: CiudadEntity[] = await provider.findAll();
    expect(ciudades).not.toBeNull();
    expect(ciudades).toHaveLength(listadoCiudades.length);
  });

  it('Retornar una ciudad por id', async () => {
    const ciudadAlmacenada: CiudadEntity = listadoCiudades[0];
    const ciudad: CiudadEntity = await provider.findOne(ciudadAlmacenada.id);
    expect(ciudad).not.toBeNull();
    expect(ciudad.nombre).toEqual(ciudadAlmacenada.nombre)
    expect(ciudad.id).toEqual(ciudadAlmacenada.id)
  });

  it('Retornar error cuando la ciudad es invalida', async () => {
    await expect(() => provider.findOne("0")).rejects.toHaveProperty("message", "No se encontró la ciudad con la identificación proporcionada.")
  });

  it('Crea una ciudad,  debe retornar una nueva ciudad', async () => {
    const ciudad: CiudadEntity = {
      id: faker.datatype.uuid(),
      nombre: faker.name.firstName(),
      habitantes: faker.datatype.number({'min': 10, 'max': 50}),
      pais: 'Argentina',
      supermercados:[]
    }
  
    const nuevaCiudad: CiudadEntity = await provider.create(ciudad);
    expect(nuevaCiudad).not.toBeNull();
  
    const ciudadAlmacenada: CiudadEntity = await repository.findOne({where: {id: nuevaCiudad.id}})
    expect(ciudadAlmacenada).not.toBeNull();
    expect(ciudadAlmacenada.nombre).toEqual(nuevaCiudad.nombre)
  });


  it('Actualiza una ciudad', async () => {
    const ciudad: CiudadEntity = listadoCiudades[0];
    ciudad.nombre = faker.name.firstName();
  
    const actualizarCiudad: CiudadEntity = await provider.update(ciudad.id, ciudad);
    expect(actualizarCiudad).not.toBeNull();
  
    const ciudadAlmacenada: CiudadEntity = await repository.findOne({ where: { id: ciudad.id } })
    expect(ciudadAlmacenada).not.toBeNull();
    expect(ciudadAlmacenada.nombre).toEqual(ciudad.nombre)
  });

  it('Error al actualizar una ciudad', async () => {
    let ciudad: CiudadEntity = listadoCiudades[0];
    ciudad = {
      ...ciudad, nombre: "Nueva ciudad"
    }
    await expect(() => provider.update("0", ciudad)).rejects.toHaveProperty("message", "No se encontró la ciudad con la identificación proporcionada.")
  });

  it('Elimina una ciudad', async () => {
    const ciudad: CiudadEntity = listadoCiudades[0];
    await provider.delete(ciudad.id);
  
    const ciudadEliminar: CiudadEntity = await repository.findOne({ where: { id: ciudad.id } })
    expect(ciudadEliminar).toBeNull();
  });

  it('Error al eliminar una ciudad', async () => {
    const ciudad: CiudadEntity = listadoCiudades[0];
    await provider.delete(ciudad.id);
    await expect(() => provider.delete("0")).rejects.toHaveProperty("message","No se encontró la ciudad con la identificación proporcionada.")
  });
});
