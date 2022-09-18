import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { SupermercadoDto } from '../../../supermercado/dtos/supermercado.dto';
import { CiudadSupermercadoService } from '../../../ciudad-supermercado/providers/ciudad-supermercado/ciudad-supermercado.service';
import { BusinessErrorsInterceptor } from '../../../shared/interceptors/business-errors.interceptor';
import { SupermercadoEntity } from '../../../supermercado/entities/supermercado.entity';
import { plainToInstance } from 'class-transformer';
@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadSupermercadoController {
    constructor(
        private readonly ciudadSupermercadoService: CiudadSupermercadoService
    ) { }
    @Post(':ciudadId/supermarkets/:supermercadoId')
    async addSupermarketToCity(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string){
        return this.ciudadSupermercadoService.addSupermarketToCity(supermercadoId, ciudadId);
    }
    
    @Get(':ciudadId/supermarkets')
    findSupermarketsFromCity(@Param('ciudadId') ciudadId: string){
        return this.ciudadSupermercadoService.findSupermarketsFromCity(ciudadId);
    }

    @Get(':ciudadId/supermarkets/:supermercadoId')
    findSupermarketFromCity(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string){
        return this.ciudadSupermercadoService.findSupermarketFromCity(supermercadoId, ciudadId);
    }

    @Put(':ciudadId/supermarkets/:supermercadoId')
    updateSupermarketsFromCity(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string, @Body() supermercadoDto: SupermercadoDto){
        const supermercado: SupermercadoEntity = plainToInstance(SupermercadoEntity, supermercadoDto);
        return this.ciudadSupermercadoService.updateSupermarketsFromCity(supermercadoId, ciudadId, supermercado)
    }

    @Delete(':ciudadId/supermarkets/:supermercadoId')
    @HttpCode(204)
    deleteSupermarketFromCity(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string){
        return this.ciudadSupermercadoService.deleteSupermarketFromCity(supermercadoId, ciudadId);
    }
}
