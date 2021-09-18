import { Module, HttpModule, HttpService } from '@nestjs/common';
import { UsersResolver } from './user.resolver';
import { UserService } from './user-service';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
import { PrismaClientService } from 'src/prisma-client/prisma-client-service';


@Module({
  imports: [HttpModule,PrismaClientModule,],
  providers: [UsersResolver,UserService],
})
export class UserModule {}
