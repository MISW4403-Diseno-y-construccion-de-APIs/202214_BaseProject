import { Test, TestingModule } from '@nestjs/testing';
import { SupermercadoController } from './supermercado.controller';
import { TypeOrmTestingConfig } from '../../../shared/testing-utils/typeorm-testing-config';
import { SupermercadoService } from '../../providers/supermercado.service';

describe('SupermercadoController', () => {
  let controller: SupermercadoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      controllers: [SupermercadoController],
      providers:[SupermercadoService]
    }).compile();

    controller = module.get<SupermercadoController>(SupermercadoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
