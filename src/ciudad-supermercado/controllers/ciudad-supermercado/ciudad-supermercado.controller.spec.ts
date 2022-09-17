import { Test, TestingModule } from '@nestjs/testing';
import { CiudadSupermercadoController } from './ciudad-supermercado.controller';

describe('CiudadSupermercadoController', () => {
  let controller: CiudadSupermercadoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CiudadSupermercadoController],
    }).compile();

    controller = module.get<CiudadSupermercadoController>(CiudadSupermercadoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
