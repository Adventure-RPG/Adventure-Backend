import {Module} from '@nestjs/common';
import {EmailService} from './services/email.service';
import {emailProviders} from './email.providers';
import {RepositoryService} from './services/repository.service';

@Module({
    components: [EmailService, RepositoryService, ...emailProviders],
    exports: [EmailService, RepositoryService],
})
export class EmailModule {}
