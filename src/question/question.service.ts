import { Injectable } from '@nestjs/common';
import { Question } from './question.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb'

@Injectable()
export class QuestionService {

    @InjectRepository(Question) 
    private questionRepository: Repository<Question>;

}