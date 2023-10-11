import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { Types } from 'mongoose'
import { ModelType } from '@typegoose/typegoose/lib/types'

import { RatingModel } from './rating.model'
import { MovieService } from 'src/movie/movie.service'
import { SetRatingDto } from './dto/set-rating.dto'

@Injectable()
export class RatingService {
	constructor(
		@InjectModel(RatingModel)
		private readonly ratingModel: ModelType<RatingModel>,
		private readonly movieService: MovieService
	) {}

	async getMovieValueByUser(movieId: Types.ObjectId, userId: Types.ObjectId) {
		return this.ratingModel
			.findOne({ movieId, userId })
			.select('value')
			.exec()
			.then((data) => (data ? data.value : 0))
	}

	async averageRatingbyMovie(movieId: Types.ObjectId | string) {
		const ratingsMovie: RatingModel[] = await this.ratingModel
			.aggregate()
			.match({
				movieId: new Types.ObjectId(movieId),
			})
			.exec()

		return (
			ratingsMovie.reduce((acc, item) => acc + item.value, 0) /
			ratingsMovie.length
		)
	}

	async SetRating(userId: Types.ObjectId, dto: SetRatingDto) {
		const { movieId, value } = dto

		const newRating = await this.ratingModel
			.findOneAndUpdate(
				{ movieId, userId },
				{
					movieId,
					userId,
					value,
				},
				{
					new: true,
					upsert: true,
					setDefaultsOnInsert: true,
				}
			)
			.exec()

		const averageRating = await this.averageRatingbyMovie(movieId)

		await this.movieService.updateRating(movieId, averageRating)

		return newRating
	}
}
