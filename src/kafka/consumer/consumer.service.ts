import { Injectable, Logger } from '@nestjs/common';
import {
  SubscribeTo,
  SubscribeToFixedGroup,
} from '../common/kafka/kafka.decorator';
import { KafkaPayload } from '../common/kafka/kafka.message';
import { HELLO_FIXED_TOPIC } from '../constant';

@Injectable()
export class ConsumerService {
  private readonly logger = new Logger(ConsumerService.name);

  /**
   * When group id is unique for every container.
   * @param payload
   */
  @SubscribeTo('hello.topic')
  helloSubscriber(payload: KafkaPayload) {
    this.logger.debug(
      `[KAKFA-CONSUMER] Print message after receiving ${JSON.stringify(
        payload,
      )}`,
    );
  }

  /**
   * When application or container scale up &
   * consumer group id is same for application
   * @param payload
   */
  @SubscribeToFixedGroup(HELLO_FIXED_TOPIC)
  helloSubscriberToFixedGroup(payload: KafkaPayload) {
    this.logger.debug(
      `[KAKFA-CONSUMER] Print message after receiving for fixed group ${JSON.stringify(
        payload,
      )}`,
    );
  }

  /**
   * When group id is unique for every container.
   * @param payload
   */
  @SubscribeTo('hello.topic2')
  helloSubscriber2(payload: KafkaPayload) {
    this.logger.debug(
      `[KAKFA-CONSUMER] Print message after receiving ${JSON.stringify(
        payload,
      )}`,
    );
  }
}
