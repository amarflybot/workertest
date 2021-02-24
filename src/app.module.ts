import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostService } from './post/post.service';
import { PostModule } from './post/post.module';
import {
  TerminusModule,
  TerminusModuleOptions,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Post } from './post/post';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './task/task.service';
import { KafkaModule } from './kafka/common/kafka/kafka.module';
import { DefaultModule } from './kafka/default/default.module';
import { ConsumerModule } from './kafka/consumer/consumer.module';

const getTerminusOptions = (
  db: TypeOrmHealthIndicator,
): TerminusModuleOptions => ({
  endpoints: [
    {
      // The health check will be available with /health
      url: '/health',
      // All the indicator which will be checked when requesting /health
      healthIndicators: [
        // Set the timeout for a response to 300ms
        async () => db.pingCheck('database', { timeout: 300 }),
      ],
    },
  ],
});

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        host: configService.get<string>('POSTGRES_HOST'),
        entities: [Post],
        synchronize: true,
      }),
    }),
    KafkaModule.register({
      clientId: 'test-app-client',
      brokers: ['kafka:9092'],
      groupId: 'test-app-group',
    }),
    TerminusModule.forRootAsync({
      // Inject the TypeOrmHealthIndicator provided by nestjs/terminus
      inject: [TypeOrmHealthIndicator],
      useFactory: (db) => getTerminusOptions(db),
    }),
    TypeOrmModule.forFeature([Post]),
    ScheduleModule.forRoot(),
    PostModule,
    DefaultModule,
    ConsumerModule,
  ],
  providers: [PostService, TaskService],
})
export class AppModule {}
