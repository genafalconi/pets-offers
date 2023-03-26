import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OffersModule } from './offers/offers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `env/${process.env.NODE_ENV || 'dev'}.env`,
    }),
    OffersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
