import {Test} from '@nestjs/testing';
import {TestingModule} from '@nestjs/testing/testing-module';
import {EmailService} from './email.service';
import {expect} from 'chai';

describe('EmailService', () => {
  let module: TestingModule;
  beforeEach(() => {
    return Test.createTestingModule({
      components: [
        EmailService
      ]
    }).compile()
      .then(compiledModule => module = compiledModule);
  });

  let service: EmailService;
  beforeEach(() => {
    service = module.get(EmailService);
  });

  it('should exist', () => {
    expect(service).to.exist;
  });
});
