// import { Resolver, Query, ResolveProperty, Mutation } from '@nestjs/graphql';
// import { UsersPersistenceService } from '../../persistence/';
// import { LessonDbModel } from '../../../models/lesson.db.model';
// // import { RoomDbModel } from '../../../models/room.db.model';

// @Resolver('Lesson')
// export class LessonsResolver {
//   constructor(private usersPersistence: UsersPersistenceService) {}
//   lessons: LessonDbModel[] = [
//     {
//       _id: 'lesson123',
//       title: 'שיעור התעמלות',
//       startTime: '07:30',
//       endTime: '08:00',
//       icon: 'sport',
//       room: 'room1',
//     },
//   ];

//   @Query('lessons')
//   async getLessons(obj, args, context, info) {
//     return this.lessons;
//   }

//   @Query('lesson')
//   async getLessonById(obj, args, context, info) {
//     return this.lessons[0];
//   }

//   @Mutation('createLesson')
//   async createLesson(obj, args, context, info) {
//     const newLesson: LessonDbModel = {
//       _id: `lesson${this.lessons.length}`,
//       title: args.title,
//       startTime: args.startTime,
//       endTime: args.endTime,
//       icon: args.icon,
//       room: args.room,
//     };
//     this.lessons.push(newLesson);
//     return newLesson;
//   }
// }
