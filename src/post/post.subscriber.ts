import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Post } from './post';
import { Logger } from '@nestjs/common';
import { worker } from 'cluster';

@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface<Post> {
  private readonly logger = new Logger(PostSubscriber.name);

  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Post;
  }

  beforeInsert(event: InsertEvent<Post>) {
    this.logger.debug(`Before Post Inserted ${JSON.stringify(event.entity)}`);
  }
}
