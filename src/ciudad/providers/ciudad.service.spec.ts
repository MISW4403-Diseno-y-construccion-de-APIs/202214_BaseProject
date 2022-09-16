import { Test, TestingModule } from '@nestjs/testing';
// import { TypeOrmTestingConfig } from '../config/typeorm-testing-config';
import { CiudadService } from './ciudad.service';

describe('CiudadService', () => {
  let provider: CiudadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();

    provider = module.get<CiudadService>(CiudadService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
