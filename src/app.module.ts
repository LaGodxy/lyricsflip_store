import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { APP_GUARD, Reflector } from '@nestjs/core'

import { validationSchema } from './config/validation.schema'

import { AppController } from './app.controller'
import { AppService } from './app.service'

import { RolesGuard } from './common/guards/roles.guard'

import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { ArtistsModule } from './modules/artists/artists.module'
import { MusicModule } from './modules/music/music.module'
import { MerchandiseModule } from './modules/merchandise/merchandise.module'
import { StreamingModule } from './modules/streaming/streaming.module'
import { PurchasesModule } from './modules/purchases/purchases.module'
import { EventsModule } from './modules/events/events.module'
import { AnalyticsModule } from './modules/analytics/analytics.module'
import { NotificationsModule } from './modules/notifications/notifications.module'
import { AdminModule } from './modules/admin/admin.module'
import { TracksModule } from './modules/music/tracks/tracks.module'
import appConfig, { databaseConfig } from './config/database.config'
import { BandsModule } from './modules/bands/bands.module';
import { VideosModule } from './modules/videos/videos.module';
import { FundingModule } from './modules/funding/funding.module';
import { DistributionsModule } from './modules/distributions/distributions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env.local', '.env'],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'), 
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('nodeEnv') === 'development',
        logging: configService.get<string>('nodeEnv') === 'development',
      }),
    }),

    AuthModule,
    UsersModule,
    ArtistsModule,
    MusicModule,
    MerchandiseModule,
    StreamingModule,
    PurchasesModule,
    EventsModule,
    AnalyticsModule,
    NotificationsModule,
    AdminModule,
    TracksModule,
    BandsModule,
    VideosModule,
    FundingModule,
    DistributionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Reflector,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
