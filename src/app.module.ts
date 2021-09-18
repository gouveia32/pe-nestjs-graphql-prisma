import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { UserModule } from './user/user.module';
//import { PrismaClientModule } from './prisma-client/prisma-client.module';
import { UserService } from './user/user-service';
import { PrismaClientModule } from './prisma-client/prisma-client.module';
import { UsersResolver } from './user/user.resolver';
import { FirebaseModule } from './firebase-admin/firebase.module';
import { AppLoggerModule } from './app-logger/app-logger.module';
import { AuthMiddleware } from './auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/models/graphql.ts'),
        outputAs: 'class',
      },
      context:({ req })=>{
        return {auth:req.auth}
      },
      debug: true,
      playground: true,
    }),
   UserModule,
   FirebaseModule,
   AppLoggerModule
  ],
})
export class AppModule implements NestModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(AuthMiddleware).forRoutes('/graphql')
  }
}
