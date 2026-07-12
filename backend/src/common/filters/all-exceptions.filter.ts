import { Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch()
export class AllExceptionsFilter implements GqlExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const info = gqlHost.getInfo();

    let status = 500;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();
      message =
        typeof response === 'string'
          ? response
          : (response as any).message || exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    this.logger.error(
      `Error in ${info?.fieldName}: ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    return new GraphQLError(message, {
      extensions: {
        code: status,
      },
    });
  }
}
