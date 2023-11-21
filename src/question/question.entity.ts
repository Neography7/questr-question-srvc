import { Entity, ObjectIdColumn, ObjectId, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

@Entity('questions')
export class Question {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Column()
  userID: string;

  @Transform(({ value, obj }) => (obj.anon ? null: value))
  @Column()
  creatorID: string;

  @Column()
  question: string;

  @Column()
  answer: string;

  @Column()
  anon: boolean = true;

  @Transform(({ value }) => value.toISOString())
  @CreateDateColumn()
  createdAt: Date;

  @Transform(({ value }) => value.toISOString())
  @UpdateDateColumn()
  updatedAt: Date;

  @IsBoolean()
  deleted: boolean;
}