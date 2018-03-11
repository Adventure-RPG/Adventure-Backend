import {Test} from '@nestjs/testing';
import {TestingModule} from '@nestjs/testing/testing-module';
import {RepositoryService} from './repository.service';
import {expect} from 'chai';

describe('RepositoryService', () => {
  let module: TestingModule;
  beforeEach(() => {
    return Test.createTestingModule({
      components: [
        RepositoryService
      ]
    }).compile()
      .then(compiledModule => module = compiledModule);
  });

  let service: RepositoryService;
  beforeEach(() => {
    service = module.get(RepositoryService);
  });

  it('should exist', () => {
    expect(service).to.exist;
  });
});
