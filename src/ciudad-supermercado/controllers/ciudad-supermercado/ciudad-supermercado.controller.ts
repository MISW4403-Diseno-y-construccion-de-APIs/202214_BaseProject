import { Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { CiudadSupermercadoService } from 'src/ciudad-supermercado/providers/ciudad-supermercado/ciudad-supermercado.service';
import { BusinessErrorsInterceptor } from '../../../shared/interceptors/business-errors.interceptor';
// @Controller('ciudad-supermercado')
@Controller('ciudades')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadSupermercadoController {
    constructor(
        private readonly ciudadSupermercadoService: CiudadSupermercadoService
    ) { }
    @Post(':ciudadId/supermercados/:supermercadoId')
    async addSupermarketToCity(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string){
        return this.ciudadSupermercadoService.addSupermarketToCity(supermercadoId, ciudadId);
    }
    
    @Get(':ciudadId/supermercados')
    findSupermarketsFromCity(@Param('ciudadId') ciudadId: string){
        return this.ciudadSupermercadoService.findSupermarketsFromCity(ciudadId);
    }

    @Get(':ciudadId/supermercados/:supermercadoId')
    findSupermarketFromCity(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string){
        return this.ciudadSupermercadoService.findSupermarketFromCity(supermercadoId, ciudadId);
    }

    updateSupermarketsFromCity(){}
    deleteSupermarketFromCity(){}
}
