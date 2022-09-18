import { Test, TestingModule } from '@nestjs/testing';
import { CiudadSupermercadoController } from './ciudad-supermercado.controller';
import { TypeOrmTestingConfig } from '../../../shared/testing-utils/typeorm-testing-config';
import { CiudadSupermercadoService } from '../../providers/ciudad-supermercado/ciudad-supermercado.service';


describe('CiudadSupermercadoController', () => {
  let controller: CiudadSupermercadoController;
  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      controllers: [CiudadSupermercadoController],
      providers:[CiudadSupermercadoService]
    }).compile();

    controller = module.get<CiudadSupermercadoController>(CiudadSupermercadoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
