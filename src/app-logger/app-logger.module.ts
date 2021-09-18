import { Module, Injectable, Logger, Global } from '@nestjs/common';

@Injectable()
export class AppLogger extends Logger{}

@Global()
@Module({
    providers:[AppLogger],
    exports: [AppLogger]
})
export class AppLoggerModule {}


