/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { wrappers } from "protobufjs";
import { Observable } from "rxjs";
import { Struct } from "./google/protobuf/struct.pb";

export const protobufPackage = "question";

/** Response */
export interface Response {
  status: number;
  error: boolean;
  message: string;
  data?: { [key: string]: any } | undefined;
}

/** Question */
export interface CreateQuestionRequest {
  authID?: string | undefined;
  question: string;
  userID?: string | undefined;
  anon?: boolean | undefined;
}

export interface DeleteQuestionRequest {
  authID: string;
  questionID: string;
}

/** Answer */
export interface CreateAnswerRequest {
  authID: string;
  questionID: string;
  answer: string;
}

export interface DeleteAnswerRequest {
  authID: string;
  questionID: string;
}

export interface GetQuestionsRequest {
  userID?: string | undefined;
  username?: string | undefined;
  page: number;
}

export interface GetQuestionRequest {
  authID?: string | undefined;
  questionID: string;
}

export interface GetUnansweredsRequest {
  authID: string;
  page: number;
}

export const QUESTION_PACKAGE_NAME = "question";

wrappers[".google.protobuf.Struct"] = { fromObject: Struct.wrap, toObject: Struct.unwrap } as any;

export interface QuestionServiceClient {
  createQuestion(request: CreateQuestionRequest, metadata?: Metadata): Observable<Response>;

  deleteQuestion(request: DeleteQuestionRequest, metadata?: Metadata): Observable<Response>;

  createAnswer(request: CreateAnswerRequest, metadata?: Metadata): Observable<Response>;

  deleteAnswer(request: DeleteAnswerRequest, metadata?: Metadata): Observable<Response>;

  getQuestions(request: GetQuestionsRequest, metadata?: Metadata): Observable<Response>;

  getQuestion(request: GetQuestionRequest, metadata?: Metadata): Observable<Response>;

  getUnanswereds(request: GetUnansweredsRequest, metadata?: Metadata): Observable<Response>;
}

export interface QuestionServiceController {
  createQuestion(
    request: CreateQuestionRequest,
    metadata?: Metadata,
  ): Promise<Response> | Observable<Response> | Response;

  deleteQuestion(
    request: DeleteQuestionRequest,
    metadata?: Metadata,
  ): Promise<Response> | Observable<Response> | Response;

  createAnswer(request: CreateAnswerRequest, metadata?: Metadata): Promise<Response> | Observable<Response> | Response;

  deleteAnswer(request: DeleteAnswerRequest, metadata?: Metadata): Promise<Response> | Observable<Response> | Response;

  getQuestions(request: GetQuestionsRequest, metadata?: Metadata): Promise<Response> | Observable<Response> | Response;

  getQuestion(request: GetQuestionRequest, metadata?: Metadata): Promise<Response> | Observable<Response> | Response;

  getUnanswereds(
    request: GetUnansweredsRequest,
    metadata?: Metadata,
  ): Promise<Response> | Observable<Response> | Response;
}

export function QuestionServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createQuestion",
      "deleteQuestion",
      "createAnswer",
      "deleteAnswer",
      "getQuestions",
      "getQuestion",
      "getUnanswereds",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("QuestionService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("QuestionService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const QUESTION_SERVICE_NAME = "QuestionService";
