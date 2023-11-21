import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionService } from './question.service';
import { UserModule } from 'src/user/user.module';
import { Question } from './question.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question]),
    UserModule
  ],
  controllers: [QuestionController],
  providers: [QuestionService]
})
export class QuestionModule {}
