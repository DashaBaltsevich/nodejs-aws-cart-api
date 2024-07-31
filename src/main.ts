import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ExpressAdapter } from '@nestjs/platform-express';
// import express from 'express';
// import { Handler, Context, Callback } from 'aws-lambda';
// import serverlessExpress from '@codegenie/serverless-express';
import helmet from 'helmet';

//task9

const port = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  app.use(helmet());

  await app.listen(port);
}
bootstrap().then(() => {
  console.log('App is running on %s port', port);
});

//task8
// let cachedServer: Handler;

// async function bootstrap() {
//   if (!cachedServer) {
//     const expressApp = express();
//     const expressAdapter = new ExpressAdapter(expressApp);
//     const app = await NestFactory.create(AppModule, expressAdapter);
//     app.enableCors({
//       origin: '*',
//       methods: '*',
//       allowedHeaders: 'Content-Type, Accept, Authorization',
//     });
//     await app.init();
//     cachedServer = serverlessExpress({ app: expressApp });
//   }
//   return cachedServer;
// }

// export const handler: Handler = async (
//   event: any,
//   context: Context,
//   callback: Callback,
// ) => {
//   console.log('event from handler', JSON.stringify(event));
//   const server = await bootstrap();
//   return server(event, context, callback);
// };
