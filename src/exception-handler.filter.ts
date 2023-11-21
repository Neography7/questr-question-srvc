import { Response as UserResponse } from './../proto/user.pb';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';
import { Observable, throwError } from 'rxjs';

@Catch(HttpException)
export class RPCExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException) {

    const status = exception.getStatus();
    const res = exception.getResponse() as {
      details?: unknown;
      message: unknown;
      error: string;
      statusCode: number;
    };

    if (status === HttpStatus.BAD_REQUEST) {

      const errorResponse = { status, error: true, message: res.message ?? "Bad Request", data: {"errorMessages": res.message } }

      return new Observable(observer => {
        observer.next(errorResponse);
        observer.complete();
      });

    }

    console.log('httpStatus', status, res);

    // if (status === HttpStatus.BAD_REQUEST) {
    //   const res: any = exception.getResponse();
    //   new RpcException({
        

    //   return { status, error: true, message };
    // }
  }
}