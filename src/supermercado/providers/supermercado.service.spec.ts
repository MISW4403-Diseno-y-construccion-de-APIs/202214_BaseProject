import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../../shared/testing-utils/typeorm-testing-config';
import { SupermercadoEntity } from '../entities/supermercado.entity';
import { SupermercadoService } from './supermercado.service';
import { getRepositoryToken} from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';


describe('SupermercadoService', () => {
  let provider: SupermercadoService;
  let repository: Repository<SupermercadoEntity>;
  let listadoSupermercados: SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService],
    }).compile();

    provider = module.get<SupermercadoService>(SupermercadoService);
    repository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    listadoSupermercados = [];

    for(let i = 0; i < 5; i++){
        const supermercado: SupermercadoEntity = await repository.save({
          id: faker.datatype.uuid(),
          nombre: faker.company.name(),
          longitud: faker.address.latitude(),
          latitud: faker.address.latitude(),
          pagina: faker.internet.url(),
        })
        listadoSupermercados.push(supermercado);
    }
  }

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('Retornar todos los supermercados', async () => {
    const supermercados: SupermercadoEntity[] = await provider.findAll();
    expect(supermercados).not.toBeNull();
    expect(supermercados).toHaveLength(listadoSupermercados.length);
  });

  it('Retornar un supermercado por id', async () => {
    const supermercadoAlmacenada: SupermercadoEntity = listadoSupermercados[0];
    const supermercado: SupermercadoEntity = await provider.findOne(supermercadoAlmacenada.id);
    expect(supermercado).not.toBeNull();
    expect(supermercado.nombre).toEqual(supermercadoAlmacenada.nombre)
    expect(supermercado.latitud).toEqual(supermercadoAlmacenada.latitud)
    expect(supermercado.longitud).toEqual(supermercadoAlmacenada.longitud)
    expect(supermercado.id).toEqual(supermercadoAlmacenada.id)
  });

  it('Retornar error cuando el supermercado es invalido', async () => {
    await expect(() => provider.findOne("0")).rejects.toHaveProperty("message", "No se encontró el supermercado con la identificación proporcionada.")
  });

  it('Crea una supermercado,  debe retornar un nuevo supermercado', async () => {
    const supermercado: SupermercadoEntity = {
      id: faker.datatype.uuid(),
      nombre: faker.company.name(),
      longitud: faker.address.latitude(),
      latitud: faker.address.latitude(),
      pagina: faker.internet.url(),
      ciudades:[]
    }
  
    const nuevasupermercado: SupermercadoEntity = await provider.create(supermercado);
    expect(nuevasupermercado).not.toBeNull();
  
    const supermercadoAlmacenada: SupermercadoEntity = await repository.findOne({where: {id: nuevasupermercado.id}})
    expect(supermercadoAlmacenada).not.toBeNull();
    expect(supermercadoAlmacenada.nombre).toEqual(nuevasupermercado.nombre)
  });


  it('Actualiza un supermercado', async () => {
    const supermercado: SupermercadoEntity = listadoSupermercados[0];
    supermercado.nombre = faker.company.name()
  
    const actualizarsupermercado: SupermercadoEntity = await provider.update(supermercado.id, supermercado);
    expect(actualizarsupermercado).not.toBeNull();
  
    const supermercadoAlmacenada: SupermercadoEntity = await repository.findOne({ where: { id: supermercado.id } })
    expect(supermercadoAlmacenada).not.toBeNull();
    expect(supermercadoAlmacenada.nombre).toEqual(supermercado.nombre)
  });

  it('Error al actualizar un supermercado', async () => {
    let supermercado: SupermercadoEntity = listadoSupermercados[0];
    supermercado = {
      ...supermercado, nombre: "Nueva supermercado"
    }
    await expect(() => provider.update("0", supermercado)).rejects.toHaveProperty("message", "No se encontró el supermercado con la identificación proporcionada.")
  });

  it('Elimina un supermercado', async () => {
    const supermercado: SupermercadoEntity = listadoSupermercados[0];
    await provider.delete(supermercado.id);
  
    const supermercadoEliminar: SupermercadoEntity = await repository.findOne({ where: { id: supermercado.id } })
    expect(supermercadoEliminar).toBeNull();
  });

  it('Error al eliminar un supermercado', async () => {
    const supermercado: SupermercadoEntity = listadoSupermercados[0];
    await provider.delete(supermercado.id);
    await expect(() => provider.delete("0")).rejects.toHaveProperty("message","No se encontró el supermercado con la identificación proporcionada.")
  });
});
