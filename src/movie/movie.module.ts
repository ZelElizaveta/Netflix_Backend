import { Module } from '@nestjs/common'
import { MovieService } from './movie.service'
import { MovieController } from './movie.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { MovieModel } from './movie.model'
import { TelegramModule } from 'src/telegram/telegram.module'
import { ConfigModule } from '@nestjs/config'

@Module({
	providers: [MovieService],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: MovieModel,
				schemaOptions: {
					collection: 'Movie',
				},
			},
		]),
		TelegramModule,
		ConfigModule,
	],
	controllers: [MovieController],
	exports: [MovieService],
})
export class MovieModule {}
