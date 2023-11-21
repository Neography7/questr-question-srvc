import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_SERVICE_NAME, USER_PACKAGE_NAME } from '../../proto/user.pb';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

@Module({  
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: USER_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: process.env.USER_SERVICE,
          package: USER_PACKAGE_NAME,
          protoPath: join('node_modules/questr-proto/proto/user.proto'),
        },
      },
    ]),
  ],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
