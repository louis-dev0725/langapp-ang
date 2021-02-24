// Flag to load QueueProcessor, see background.module.ts
(<any>global).useQueueProcessor = process.argv[2] == "processQueue";
import { BootstrapConsole } from 'nestjs-console';
import { AppModule } from './app.module';

const bootstrap = new BootstrapConsole({
    module: AppModule,
    useDecorators: true
});
bootstrap.init().then(async (app) => {
    try {
        await app.init();
        await bootstrap.boot();
        await app.close();
        process.exit(0);
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
});