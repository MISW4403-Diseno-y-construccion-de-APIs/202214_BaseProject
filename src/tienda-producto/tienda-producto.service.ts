import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ProductoEntity } from 'src/producto/producto.entity';
import { TiendaEntity } from 'src/tienda/tienda.entity';

@Injectable()
export class TiendaProductoService {
    constructor(
        @InjectRepository(TiendaEntity)
        private readonly tiendaRepository: Repository<TiendaEntity>,
    
        @InjectRepository(ProductoEntity)
        private readonly productoRepository: Repository<ProductoEntity>
    ) {}

    async addTiendaProducto(productoId: string, tiendaId: string): Promise<ProductoEntity> {
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendaId}});
        if (!tienda)
          throw new BusinessLogicException("The tienda con ese ID no existe", BusinessError.NOT_FOUND);
      
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}, relations: ["tiendas"]})
        if (!producto)
          throw new BusinessLogicException("El producto con ese ID no existe", BusinessError.NOT_FOUND);
    
        producto.tiendas = [...producto.tiendas, tienda];
        return await this.productoRepository.save(producto);
      }

    async findTiendasByProductoId(productoId: string): Promise<TiendaEntity[]> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}, relations: ["tiendas"]});
        if (!producto)
          throw new BusinessLogicException("El producto con ese ID no existe", BusinessError.NOT_FOUND)
       
        return producto.tiendas;
    }
    
    async findTiendaByProductoId(productoId: string): Promise<TiendaEntity[]> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}, relations: ["tienda"]});
        if (!producto)
          throw new BusinessLogicException("El producto con ese ID no existe", BusinessError.NOT_FOUND)
       
        return producto.tiendas;
    }

    async deleteTiendaProducto(productoId: string, tiendaId: string){
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendaId}});
        if (!tienda)
          throw new BusinessLogicException("La tienda con ese ID no existe", BusinessError.NOT_FOUND)
    
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}, relations: ["tiendas"]});
        if (!producto)
          throw new BusinessLogicException("El producto con ese ID no existe", BusinessError.NOT_FOUND)
    
        const productoTienda: TiendaEntity = producto.tiendas.find(e => e.id === tienda.id);
    
        if (!productoTienda)
            throw new BusinessLogicException("La tienda con ese ID no esta asociada al producto", BusinessError.PRECONDITION_FAILED)
 
        producto.tiendas = producto.tiendas.filter(e => e.id !== tiendaId);
        await this.productoRepository.save(producto);
    } 
}