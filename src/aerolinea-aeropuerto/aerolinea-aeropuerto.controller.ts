import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AerolineaDto } from '../aerolinea/aerolinea.dto';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';


@Controller('aeropuertos')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaAeropuertoController {
    constructor(private readonly aerolineaAeropuertoService: AerolineaAeropuertoService){}

   @Post(':aeropuertoId/aerolineas/:aerolineaId')
   async addAeropuertoAerolinea(@Param('aeropuertoId') aeropuertoId: string, @Param('aerolineaId') aerolineaId: string){
       return await this.aerolineaAeropuertoService.addAeropuertoAerolinea(aeropuertoId, aerolineaId);
   }

   @Get(':aeropuertoId/aerolineas/:aerolineaId')
   async findAerolineaIdAeropuertoId(@Param('aeropuertoId') aeropuertoId: string, @Param('aerolineaId') aerolineaId: string){
       return await this.aerolineaAeropuertoService.findAerolineaIdAeropuertoId(aeropuertoId, aerolineaId);
   }

   @Get(':aeropuertoId/aerolineas')
    async findAirportFromAirline(@Param('aeropuertoId') aeropuertoId: string){
        return await this.aerolineaAeropuertoService.findAirportFromAirline(aeropuertoId);
    }

    @Put(':aeropuertoId/aerolineas')
    async associateAerolineaAeropuerto(@Body() aerolineaDto: AerolineaDto[], @Param('aeropuertoId') aeropuertoId: string){
        const aeropuerto = plainToInstance(AeropuertoEntity, aerolineaDto)
        return await this.aerolineaAeropuertoService.associateAerolineaAeropuerto(aeropuertoId, aeropuerto);
    }

    @Delete(':aeropuertoId/aerolineas/:aerolineaId')
    @HttpCode(204)
    async deleteAerolineaAeropuerto(@Param('aeropuertoId') aeropuertoId: string, @Param('aerolineaId') aerolineaId: string){
        return await this.aerolineaAeropuertoService.deleteAerolineaAeropuerto(aeropuertoId, aerolineaId);
    }
}
