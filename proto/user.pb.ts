/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { wrappers } from "protobufjs";
import { Observable } from "rxjs";
import { Struct } from "./google/protobuf/struct.pb";

export const protobufPackage = "user";

/** Response */
export interface Response {
  status: number;
  error: boolean;
  message: string;
  data?: { [key: string]: any } | undefined;
}

/** User */
export interface GetUserByIDReqest {
  id: string;
}

export interface UserResponse {
  id: string;
  username: string;
}

export interface UserRequest {
  id: string;
}

/** Get User */
export interface GetUserRequest {
  username: string;
}

/** Register */
export interface CreateUserRequest {
  email: string;
  username: string;
  nickname: string;
  password: string;
}

/** Validate User */
export interface ValidateUserRequest {
  email: string;
  password: string;
}

/** UploadAvatarRequest */
export interface UploadAvatarRequest {
  userID: string;
  avatarBase64: string;
}

/** Change Password */
export interface ChangePasswordRequest {
  userID: string;
  oldPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

/** Change Information Request */
export interface ChangeInformationRequest {
  userID: string;
  email: string;
  username: string;
  nickname: string;
  bio: string;
}

/** User */
export interface GetInformationRequest {
  id: string;
}

export const USER_PACKAGE_NAME = "user";

wrappers[".google.protobuf.Struct"] = { fromObject: Struct.wrap, toObject: Struct.unwrap } as any;

export interface UserServiceClient {
  user(request: UserRequest, metadata?: Metadata): Observable<Response>;

  createUser(request: CreateUserRequest, metadata?: Metadata): Observable<Response>;

  validateUser(request: ValidateUserRequest, metadata?: Metadata): Observable<Response>;

  getUserById(request: GetUserByIDReqest, metadata?: Metadata): Observable<Response>;

  getUser(request: GetUserRequest, metadata?: Metadata): Observable<Response>;

  uploadAvatar(request: UploadAvatarRequest, metadata?: Metadata): Observable<Response>;

  changePassword(request: ChangePasswordRequest, metadata?: Metadata): Observable<Response>;

  changeInformation(request: ChangeInformationRequest, metadata?: Metadata): Observable<Response>;

  getInformation(request: GetInformationRequest, metadata?: Metadata): Observable<Response>;
}

export interface UserServiceController {
  user(request: UserRequest, metadata?: Metadata): Promise<Response> | Observable<Response> | Response;

  createUser(request: CreateUserRequest, metadata?: Metadata): Promise<Response> | Observable<Response> | Response;

  validateUser(request: ValidateUserRequest, metadata?: Metadata): Promise<Response> | Observable<Response> | Response;

  getUserById(request: GetUserByIDReqest, metadata?: Metadata): Promise<Response> | Observable<Response> | Response;

  getUser(request: GetUserRequest, metadata?: Metadata): Promise<Response> | Observable<Response> | Response;

  uploadAvatar(request: UploadAvatarRequest, metadata?: Metadata): Promise<Response> | Observable<Response> | Response;

  changePassword(
    request: ChangePasswordRequest,
    metadata?: Metadata,
  ): Promise<Response> | Observable<Response> | Response;

  changeInformation(
    request: ChangeInformationRequest,
    metadata?: Metadata,
  ): Promise<Response> | Observable<Response> | Response;

  getInformation(
    request: GetInformationRequest,
    metadata?: Metadata,
  ): Promise<Response> | Observable<Response> | Response;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "user",
      "createUser",
      "validateUser",
      "getUserById",
      "getUser",
      "uploadAvatar",
      "changePassword",
      "changeInformation",
      "getInformation",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_SERVICE_NAME = "UserService";
