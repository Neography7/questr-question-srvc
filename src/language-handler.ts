import { ExecutionContext, Injectable, NestInterceptor, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Metadata } from 'grpc';
import * as i18next from 'i18next';

@Injectable()
export class LanguageHandler implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

        const ctx = context.switchToRpc();
        const call = ctx.getContext();
        const metadata: Metadata = call;

        if (metadata && metadata.get("Language")) {
            const lang: any = typeof (metadata.get("Language")[0]) === "string" ? metadata.get("Language")[0] : "en";
            i18next.changeLanguage(lang);
        }

        return next.handle();
        
    }
}