import { Test, TestingModule } from '@nestjs/testing';
import { CiudadService } from '../../providers/ciudad.service';
// import { TypeOrmTestingConfig } from '../../config/typeorm-testing-config';
import { CiudadController } from './ciudad.controller';

describe('CiudadController', () => {
  let controller: CiudadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
      controllers: [CiudadController],
    }).compile();

    controller = module.get<CiudadController>(CiudadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
