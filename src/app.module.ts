import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypegooseModule } from 'nestjs-typegoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { getMongoDbConfig } from './config/mongo.config'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { GenreModule } from './genre/genre.module';
import { FileModule } from './file/file.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypegooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongoDbConfig,
		}),
		AuthModule,
		UserModule,
		GenreModule,
		FileModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
