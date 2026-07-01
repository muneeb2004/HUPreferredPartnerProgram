import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseEnvelope<T> {
  data: T;
  meta: any;
  errors: null;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseEnvelope<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseEnvelope<T>> {
    return next.handle().pipe(
      map(res => {
        // If the service returned an object with { data, meta }, wrap it properly
        if (res && res.data && res.meta) {
          return {
            data: res.data,
            meta: res.meta,
            errors: null,
          };
        }
        
        // Otherwise, wrap the raw result
        return {
          data: res,
          meta: {},
          errors: null,
        };
      }),
    );
  }
}
