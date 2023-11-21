import { QuestionService } from './question.service';
import { Controller, HttpStatus } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { QUESTION_SERVICE_NAME, Response } from '../../proto/question.pb';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, Not, IsNull } from 'typeorm';
import { Question } from './question.entity';
import { CreateQuestionDto, GetQuestionDto, DeleteQuestionDto, GetQuestionsDto, CreateAnswerDto, DeleteAnswerDto, GetUnansweredsDto } from './question.dto';
import { ObjectId } from 'mongodb'
import { UserService } from 'src/user/user.service';
import { instanceToPlain } from 'class-transformer';
import * as i18next from 'i18next';

@Controller('Question')
export class QuestionController {

    constructor(private readonly questionService: QuestionService,
        private readonly userService: UserService ) {}

    @InjectRepository(Question) 
    private questionRepository: MongoRepository<Question>;

    @GrpcMethod(QUESTION_SERVICE_NAME, 'CreateQuestion')
    async createQuestion(data: CreateQuestionDto): Promise<Response> { 

        const user = await this.userService.findUserByID(data.userID)

        if (user.error)
            return { status: HttpStatus.NOT_FOUND, message: i18next.t('callback.USER_NOT_FOUND'), error: true };

        const question = new Question;

        question.creatorID = data.authID;
        question.userID    = data.userID;
        question.question  = data.question;
        question.anon      = data.anon;
        question.deleted   = false;
        
        try {

            await this.questionRepository.save(question);

            const _question = instanceToPlain(question);
            _question.creatorID = _question.anon ? null : _question.creatorID

            return { status: HttpStatus.CREATED, message: i18next.t('callback.QUESTION_CREATED'), error: false, data: { question: _question } };

        } catch (err) {

            console.log("Question Create Error: ", err)
            return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: i18next.t('callback.ANSWER_CANNOT_CREATE'), error: true };

        }
    }

    @GrpcMethod(QUESTION_SERVICE_NAME, 'GetQuestion')
    async getQuestion(data: GetQuestionDto): Promise<Response> { 

        const _question = await this.questionRepository.findOne({ where: { _id: new ObjectId(data.questionID), deleted: false }});

        const question = instanceToPlain(_question);
        
        if (!question) 
            return { status: HttpStatus.NOT_FOUND, message: i18next.t('callback.QUESTION_NOT_FOUND'), error: true };

        if (question.answer == null && question.userID.toString() !== data.authID)
            return { status: HttpStatus.NOT_FOUND, message: i18next.t('callback.QUESTION_NOT_FOUND'), error: true };

        const from = await this.userService.findUserByID(question.creatorID);
        question.from = from.data?.user;
        
        return { status: HttpStatus.ACCEPTED, message: '', error: false, data: { question: question } };
    }

    @GrpcMethod(QUESTION_SERVICE_NAME, 'GetQuestions')
    async getQuestions(data: GetQuestionsDto): Promise<Response> { 

        const questionCounts = await this.questionRepository.countBy({ userID: data.userID, answer: { $ne: null }, deleted: false });

        const totalPage = Math.ceil(questionCounts / 10)

        const page  =  data.page > totalPage ? totalPage : data.page
        const skip  = ((page - 1) * 10) < 0 ? 0 : ((page - 1) * 10)
        const limit = 10

        const _questionsRaw = await this.questionRepository.find({ where: { userID: data.userID, answer: { $ne: null }, deleted: false }, skip: skip, take: limit, order: { createdAt: "DESC" } });

        // const totalRecords = await this.userRepository.count();
        // const users = await this.userRepository.find({ skip, take: limit });
        let questions: Array<Object> = [];

        for (const question of _questionsRaw) {

            const _question =  instanceToPlain(question);
            
            if (question.anon === false && question.creatorID) {

                const from = await this.userService.findUserByID(question.creatorID);
                _question.from = from.data?.user;

            }

            questions.push(_question)

        };

        if (!questions) 
            return { status: HttpStatus.NOT_FOUND, message: i18next.t('callback.QUESTION_NOT_FOUND'), error: true };

        return { status: HttpStatus.ACCEPTED, message: '', error: false, data: { questions: questions, currentPage: data.page, totalPage: totalPage, totalRecords: questionCounts } };
    }

    @GrpcMethod(QUESTION_SERVICE_NAME, 'DeleteQuestion')
    async deleteQuestion(data: DeleteQuestionDto): Promise<Response> { 

        const question = await this.questionRepository.findOne({ where: { _id: new ObjectId(data.questionID), deleted: false }});;

        if (!question) 
            return { status: HttpStatus.NOT_FOUND, message: i18next.t('callback.QUESTION_NOT_FOUND'), error: true };

        if (question.userID !== data.authID)
            return { status: HttpStatus.NOT_ACCEPTABLE, message: i18next.t('callback.QUESTION_CANNOT_DELETE'), error: true };

        await this.questionRepository.update(question, {
            deleted: true
        })
        
        return { status: HttpStatus.ACCEPTED, message: i18next.t('callback.QUESTION_DELETED'), error: false };
    }

    @GrpcMethod(QUESTION_SERVICE_NAME, 'CreateAnswer')
    async createAnswer(data: CreateAnswerDto): Promise<Response> { 

        const _question = await this.questionRepository.findOne({ where: { _id: new ObjectId(data.questionID), deleted: false }});

        if (!_question) 
            return { status: HttpStatus.NOT_FOUND, message: i18next.t('callback.QUESTION_NOT_FOUND'), error: true };

        if (_question.userID !== data.authID)
            return { status: HttpStatus.NOT_ACCEPTABLE, message: i18next.t('callback.QUESTION_CANNOT_FIND'), error: true };

        try {

            await this.questionRepository.update(_question, {
                answer: data.answer
            });

            const question = instanceToPlain(_question);

            return { status: HttpStatus.ACCEPTED, message: i18next.t('callback.ANSWER_CREATED'), error: false, data: { questionID: question._id, userID: question.userID, question: question } };

        } catch (err) {

            console.log("Answer Create Error: ", err)
            return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: i18next.t('callback.ANSWER_CANNOT_CREATE'), error: true };

        }
    }

    @GrpcMethod(QUESTION_SERVICE_NAME, 'DeleteAnswer')
    async deleteAnswer(data: DeleteAnswerDto): Promise<Response> { 

        const question = await this.questionRepository.findOne({ where: { _id: new ObjectId(data.questionID), deleted: false }});;

        if (!question) 
            return { status: HttpStatus.NOT_FOUND, message: i18next.t('callback.QUESTION_NOT_FOUND'), error: true };

        if (question.userID !== data.authID)
            return { status: HttpStatus.NOT_ACCEPTABLE, message: i18next.t('callback.QUESTION_CANNOT_FIND'), error: true };

        try {

            await this.questionRepository.update(question, {
                answer: undefined
            });

            return { status: HttpStatus.ACCEPTED, message: i18next.t('callback.ANSWER_DELETED'), error: false };

        } catch (err) {

            console.log("Answer Delete Error: ", err)
            return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: i18next.t('callback.ANSWER_CANNOT_DELETE'), error: true };

        }
    }

    @GrpcMethod(QUESTION_SERVICE_NAME, 'GetUnanswereds')
    async GetUnanswereds(data: GetUnansweredsDto): Promise<Response> { 

        const questionCounts = await this.questionRepository.countBy({ userID: data.authID, answer: { $eq: null }, deleted: false });

        const totalPage = Math.ceil(questionCounts / 10)

        const page  =  data.page > totalPage ? totalPage : data.page
        const skip  = ((page - 1) * 10) < 0 ? 0 : ((page - 1) * 10)
        const limit = 10

        const _questionsRaw = await this.questionRepository.find({ where: { userID: data.authID, answer: { $eq: null }, deleted: false }, skip: skip, take: limit, order: { createdAt: "DESC" } });

        // const totalRecords = await this.userRepository.count();
        // const users = await this.userRepository.find({ skip, take: limit });
        let questions: Array<Object> = [];

        for (const question of _questionsRaw) {

            const _question =  instanceToPlain(question);
            
            if (question.anon === false && question.creatorID) {

                const from = await this.userService.findUserByID(question.creatorID);
                _question.from = from.data?.user;

            }

            questions.push(_question)

        };

        if (!questions) 
            return { status: HttpStatus.NOT_FOUND, message: i18next.t('callback.QUESTION_NOT_FOUND'), error: true };

        return { status: HttpStatus.ACCEPTED, message: '', error: false, data: { questions: questions, currentPage: data.page, totalPage: totalPage, totalRecords: questionCounts } };

    }
}
