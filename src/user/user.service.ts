import { HttpException, HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { UserServiceClient, USER_SERVICE_NAME, Response, GetUserByIDReqest } from '../../proto/user.pb';
import { Observable, lastValueFrom } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';
import * as i18next from 'i18next';

@Injectable()
export class UserService implements OnModuleInit {

  private userService: UserServiceClient;

  @Inject(USER_SERVICE_NAME) 
  private client: ClientGrpc 
  
  public onModuleInit(): void {
    this.userService = this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  public async findUserByID (id: string): Promise<Response> {
    const data: GetUserByIDReqest = { id: id }
    const userServiceResponse = lastValueFrom(this.userService.getUserById(data, this.metadata()))
    return userServiceResponse;
  }

  public metadata(): Metadata {
    const metadata = new Metadata();
    const lang = (i18next as any).language
    metadata.add('Language', lang);
    return metadata;
  }
  
}