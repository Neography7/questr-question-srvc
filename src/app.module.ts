import { Module } from '@nestjs/common';
import { QuestionModule } from './question/question.module';
import { Question } from './question/question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { I18nService } from './i18n';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGODB_URL,
      useNewUrlParser: true,
      database: 'questr_questions',
      entities: [Question],
      synchronize: true,
    }),
    QuestionModule,
    UserModule
  ],
  providers: [I18nService]
})
export class AppModule {}
