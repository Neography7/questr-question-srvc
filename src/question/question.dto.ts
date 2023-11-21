import { IsString, IsNotEmpty, IsEmpty, IsBoolean, MinLength, MaxLength, IsNumber, IsInt } from 'class-validator';
import { CreateQuestionRequest, DeleteQuestionRequest, DeleteAnswerRequest, CreateAnswerRequest, GetQuestionsRequest, GetQuestionRequest, GetUnansweredsRequest } from '../../proto/question.pb';
import { Transform, Type } from 'class-transformer';
import validator from 'validator';
import * as i18next from 'i18next';
import { IsNull } from 'typeorm';

export class CreateQuestionDto implements CreateQuestionRequest {
  @IsString({ message: () => i18next.t('validation.INVALID_STRING', { field: 'authID' }) })
  public readonly authID: string;

  @IsString({ message: () => i18next.t('validation.INVALID_STRING', { field: 'userID' }) })
  @IsNotEmpty({ message: () => i18next.t('validation.NOT_EMPTY', { field: 'userID' }) })
  public readonly userID: string;

  @IsString({ message: () => i18next.t('validation.INVALID_STRING', { field: 'question' }) })
  @IsNotEmpty({ message: () => i18next.t('validation.NOT_EMPTY', { field: 'question' }) })
  @MinLength(3, { message: () => i18next.t('validation.MIN_LENGTH', { field: 'question', length: 3 }) })
  @MaxLength(500, { message: () => i18next.t('validation.MAX_LENGTH', { field: 'question', length: 500 }) })
  @Transform(({ value }) => validator.escape(value).trim())
  public readonly question: string;

  @IsBoolean({ message: () => i18next.t('validation.INVALID_BOOLEAN', { field: 'anon' }) })
  public readonly anon: boolean = true;
}

export class DeleteQuestionDto implements DeleteQuestionRequest {
  @IsString({ message: () => i18next.t('validation.INVALID_STRING', { field: 'authID' }) })
  public readonly authID: string;

  @IsString({ message: () => i18next.t('validation.INVALID_STRING', { field: 'questionID' }) })
  public readonly questionID: string;
}

export class CreateAnswerDto implements CreateAnswerRequest {
  @IsString({ message: () => i18next.t('validation.INVALID_STRING', { field: 'authID' }) })
  @IsNotEmpty({ message: () => i18next.t('validation.NOT_EMPTY', { field: 'authID' }) })
  public readonly authID: string;

  @IsString({ message: () => i18next.t('validation.INVALID_STRING', { field: 'questionID' }) })
  @IsNotEmpty({ message: () => i18next.t('validation.NOT_EMPTY', { field: 'questionID' }) })
  public readonly questionID: string;

  @IsString({ message: () => i18next.t('validation.INVALID_STRING', { field: 'answer' }) })
  @IsNotEmpty({ message: () => i18next.t('validation.NOT_EMPTY', { field: 'answer' }) })
  @MinLength(3, { message: () => i18next.t('validation.MIN_LENGTH', { field: 'answer', length: 3 }) })
  @MaxLength(500, { message: () => i18next.t('validation.MAX_LENGTH', { field: 'answer', length: 500 }) })
  @Transform(({ value }) => validator.escape(value).trim())
  public readonly answer: string;
}

export class DeleteAnswerDto implements DeleteAnswerRequest {
  @IsString({ message: () => i18next.t('validation.INVALID_STRING', { field: 'authID' }) })
  @IsNotEmpty({ message: () => i18next.t('validation.NOT_EMPTY', { field: 'authID' }) })
  public readonly authID: string;

  @IsString({ message: () => i18next.t('validation.INVALID_STRING', { field: 'questionID' }) })
  @IsNotEmpty({ message: () => i18next.t('validation.NOT_EMPTY', { field: 'questionID' }) })
  public readonly questionID: string;
}

export class GetQuestionsDto implements GetQuestionsRequest {
  @IsString({ message: () => i18next.t('validation.INVALID_STRING', { field: 'userID' }) })
  @IsNotEmpty({ message: () => i18next.t('validation.NOT_EMPTY', { field: 'userID' }) })
  public readonly userID: string;

  @IsInt({ message: () => i18next.t('validation.INVALID_NUMBER', { field: 'page' }) })
  public readonly page: number;
}

export class GetQuestionDto implements GetQuestionRequest {
  @IsString({ message: () => i18next.t('validation.INVALID_STRING', { field: 'questionID' }) })
  @IsNotEmpty({ message: () => i18next.t('validation.NOT_EMPTY', { field: 'questionID' }) })
  public readonly questionID: string;
  
  @IsString({ message: () => i18next.t('validation.INVALID_STRING', { field: 'authID' }) })
  public readonly authID: string;
}

export class GetUnansweredsDto implements GetUnansweredsRequest {
  @IsString({ message: () => i18next.t('validation.INVALID_STRING', { field: 'authID' }) })
  @IsNotEmpty({ message: () => i18next.t('validation.NOT_EMPTY', { field: 'authID' }) })
  public readonly authID: string;

  @IsInt({ message: () => i18next.t('validation.INVALID_NUMBER', { field: 'page' }) })
  public readonly page: number;
}