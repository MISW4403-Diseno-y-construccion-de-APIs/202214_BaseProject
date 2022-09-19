import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TiendaProductoService } from 'src/tienda-producto/tienda-producto.service';
import { ProductoEntity } from 'src/producto/producto.entity';
import { ProductoService } from 'src/producto/producto.service';
import { TiendaEntity } from 'src/tienda/tienda.entity';
import { TiendaService } from 'src/tienda/tienda.service';

describe('TiendaProductoService', () => {
  let service: TiendaProductoService;
  let tiendaRepository: Repository<TiendaEntity>;
  let productoRepository: Repository<ProductoEntity>;
  let tienda: TiendaEntity;
  let productosList : ProductoEntity[];

  const seedDatabase = async () => {
    productoRepository.clear();
    tiendaRepository.clear();
 
    productosList = [];
    for(let i = 0; i < 5; i++){
        const producto: ProductoEntity = await productoRepository.save({
          name: faker.commerce.productName(),
          price: faker.commerce.price(),
          type: "Perecedero"
        })
        productosList.push(producto);
    }
 
    tienda = await tiendaRepository.save({
      name: faker.company.name(),
      address: faker.address.secondaryAddress(),
      city: faker.address.city(),
      productos: productosList
    })
  }
  
  it('addTiendaProducto debera asociar una tienda a un producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      name: faker.company.name(),
      address: faker.address.secondaryAddress(),
      city: faker.address.city()
    });
 
    const newProducto: ProductoEntity = await productoRepository.save({
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      type: "Perecedero"
    })
 
    const result: ProductoEntity = await service.addTiendaProducto(newProducto.id, newTienda.id);
   
    expect(result.tiendas.length).toBe(1);
    expect(result.tiendas[0]).not.toBeNull();
    expect(result.tiendas[0].name).toBe(newTienda.name)
    expect(result.tiendas[0].address).toBe(newTienda.address)
    expect(result.tiendas[0].city).toBe(newTienda.city)
  });
});
