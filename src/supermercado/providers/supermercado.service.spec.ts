import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../../shared/testing-utils/typeorm-testing-config';
import { SupermercadoService } from './supermercado.service';

describe('SupermercadoService', () => {
  let provider: SupermercadoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService],
    }).compile();

    provider = module.get<SupermercadoService>(SupermercadoService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
