import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProductoEntity } from './producto.entity';
import { ProductoService } from './producto.service';

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productosList = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    productosList = [];
    repository.clear();
    for(let i = 0; i < 5; i++){
        const producto: ProductoEntity = await repository.save({
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        type: "Perecedero"})
        productosList.push(producto);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService],
    }).compile();
 
    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
   await seedDatabase();
  });

  it('findAll debera retornar todos los productos', async () => {
    const producto: ProductoEntity[] = await service.findAll();
    expect(producto).not.toBeNull();
    expect(producto).toHaveLength(productosList.length);
  });

  it('findOne debera retornar un producto por su id', async () => {
    const storedProducto: ProductoEntity = productosList[0];
    const producto: ProductoEntity = await service.findOne(storedProducto.id);
    expect(producto).not.toBeNull();
    expect(producto.name).toEqual(storedProducto.name)
    expect(producto.price).toEqual(storedProducto.price)
    expect(producto.type).toEqual(storedProducto.type)
  });

  it('findOne debera lanzar una excepcion si el producto es invalido', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El producto con ese ID no existe")
  });

  it('create debera retornar un nuevo producto', async () => {
    const producto: ProductoEntity = {
      id: "",
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      type: "Perecedero",
      tiendas: []
    }
 
    const newProducto: ProductoEntity = await service.create(producto);
    expect(newProducto).not.toBeNull();
 
    const storedProducto: ProductoEntity = await repository.findOne({where: {id: newProducto.id}})
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.name).toEqual(newProducto.name)
    expect(storedProducto.price).toEqual(newProducto.price)
    expect(storedProducto.type).toEqual(newProducto.type)
  });

  it('update debera modificar un producto', async () => {
    const producto: ProductoEntity = productosList[0];
    producto.name = "Nuevo Nombre";
    producto.price = "Nuevo Precio";
     const updatedProducto: ProductoEntity = await service.update(producto.id, producto);
    expect(updatedProducto).not.toBeNull();
     const storedProducto: ProductoEntity = await repository.findOne({ where: { id: producto.id } })
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.name).toEqual(producto.name)
    expect(storedProducto.price).toEqual(producto.price)
  });

  it('update debera lanzar una excepcion si el producto es invalido', async () => {
    let producto: ProductoEntity = productosList[0];
    producto = {
      ...producto, name: "Nuevo Nombre", price: "Nuevo Precio"
    }
    await expect(() => service.update("0", producto)).rejects.toHaveProperty("message", "El producto con ese ID no existe")
  });

  it('delete debera remover un producto', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.id);
     const deletedProducto: ProductoEntity = await repository.findOne({ where: { id: producto.id } })
    expect(deletedProducto).toBeNull();
  });

  it('delete debera lanzar una excepcion si el producto no existe', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El producto con ese ID no existe")
  });
});
