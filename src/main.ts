import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtGuard } from './guards/jwt.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new JwtGuard());
  app.enableCors(
    {
      origin: "*"
    }
  )
  await app.listen(3000);
}
bootstrap();
