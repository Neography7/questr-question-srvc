/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { wrappers } from "protobufjs";
import { Observable } from "rxjs";
import { Struct } from "./google/protobuf/struct.pb";

export const protobufPackage = "auth";

/** Response */
export interface Response {
  status: number;
  error: boolean;
  message: string;
  data?: { [key: string]: any } | undefined;
}

/** Token */
export interface TokenRenewRequest {
  token: string;
}

export interface ValidateTokenRequest {
  token: string;
}

/** User */
export interface UserResponse {
  id: number;
  username: string;
}

export interface UserRequest {
  id: number;
}

/** Register */
export interface RegisterRequest {
  email: string;
  username: string;
  nickname: string;
  password: string;
}

/** Login */
export interface LoginRequest {
  email: string;
  password: string;
  remember: boolean;
}

export const AUTH_PACKAGE_NAME = "auth";

wrappers[".google.protobuf.Struct"] = { fromObject: Struct.wrap, toObject: Struct.unwrap } as any;

export interface AuthServiceClient {
  register(request: RegisterRequest, metadata?: Metadata): Observable<Response>;

  login(request: LoginRequest, metadata?: Metadata): Observable<Response>;

  validateToken(request: ValidateTokenRequest, metadata?: Metadata): Observable<Response>;

  tokenRenew(request: TokenRenewRequest, metadata?: Metadata): Observable<Response>;
}

export interface AuthServiceController {
  register(request: RegisterRequest, metadata?: Metadata): Promise<Response> | Observable<Response> | Response;

  login(request: LoginRequest, metadata?: Metadata): Promise<Response> | Observable<Response> | Response;

  validateToken(
    request: ValidateTokenRequest,
    metadata?: Metadata,
  ): Promise<Response> | Observable<Response> | Response;

  tokenRenew(request: TokenRenewRequest, metadata?: Metadata): Promise<Response> | Observable<Response> | Response;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["register", "login", "validateToken", "tokenRenew"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_SERVICE_NAME = "AuthService";
