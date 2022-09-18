import { Test, TestingModule } from '@nestjs/testing';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { TypeOrmTestingConfig } from '../../../shared/testing-utils/typeorm-testing-config';

describe('CiudadSupermercadoService', () => {
  let service: CiudadSupermercadoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadSupermercadoService],
    }).compile();

    service = module.get<CiudadSupermercadoService>(CiudadSupermercadoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
