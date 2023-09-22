import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { OffersModule } from './offers/offers.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `env/${process.env.NODE_ENV || 'dev'}.env`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('MONGO_DB'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        autoIndex: false,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        keepAlive: true,
        keepAliveInitialDelay: 300000,
      }),
      inject: [ConfigService],
    }),
    OffersModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
