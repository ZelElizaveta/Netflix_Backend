import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'

import { RatingController } from './rating.controller'
import { RatingModel } from './rating.model'
import { MovieModule } from 'src/movie/movie.module'
import { MovieService } from 'src/movie/movie.service'
import { RatingService } from './rating.service'
import { ConfigModule } from '@nestjs/config'

@Module({
	controllers: [RatingController],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: RatingModel,
				schemaOptions: {
					collection: 'Rating',
				},
			},
		]),
		MovieModule,
	],
	providers: [RatingService],
	exports: [RatingService],
})
export class RatingModule {}
