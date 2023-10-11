import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { Types } from 'mongoose'

import { MovieModel } from './movie.model'
import { CreateMovieDto } from './dto/create-movie.dto'
import { TelegramService } from 'src/telegram/telegram.service'
import { url } from 'inspector'

@Injectable()
export class MovieService {
	constructor(
		@InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>,
		private readonly TelegramServise: TelegramService
	) {}

	async bySlug(slug: string) {
		const movie = await this.MovieModel.findOne({ slug })
			.populate('actors genres')
			.exec()
		if (!movie) {
			throw new NotFoundException('Movie not found')
		}

		return movie
	}

	async byActor(actorId: Types.ObjectId) {
		const movies = await this.MovieModel.find({ actors: actorId }).exec()
		if (!movies) {
			throw new NotFoundException('Movies not found')
		}

		return movies
	}

	async byGenres(genreIds: Types.ObjectId[]) {
		return this.MovieModel.find({ genres: { $in: genreIds } }).exec()
	}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{
						title: new RegExp(searchTerm, 'i'),
					},
				],
			}
		}

		return this.MovieModel.find(options)
			.select('-updatedAt -__v')
			.sort({
				createdAt: 'desc',
			})
			.populate('actors genres')
			.exec()
	}

	async getCount() {
		return this.MovieModel.find().count().exec()
	}

	async getCollections() {
		const movies = await this.getAll()
		const collections = movies
		return collections
	}

	async updateCountOpened(slug: string) {
		const updateMovie = await this.MovieModel.findOneAndUpdate(
			{ slug },
			{
				$inc: { countOpened: 1 },
			},
			{
				new: true,
			}
		).exec()

		if (!updateMovie) {
			throw new NotFoundException('Movie not found')
		}

		return updateMovie
	}

	async getMostPopular() {
		return await this.MovieModel.find({ countOpened: { $gt: 0 } })
			.sort({ countOpend: -1 })
			.populate('genres')
			.exec()
	}

	async updateRating(id: Types.ObjectId, newRating: number) {
		return await this.MovieModel.findByIdAndUpdate(
			id,
			{
				rating: newRating,
			},
			{
				new: true,
			}
		).exec()
	}

	// Admin
	async byId(_id: string) {
		const movie = await this.MovieModel.findById(_id)

		if (!movie) {
			throw new NotFoundException('Movie not found')
		}
		return movie
	}

	async create() {
		const defaultValue: CreateMovieDto = {
			poster: '',
			bigPoster: '',
			title: '',
			slug: '',
			videoUrl: '',
			genres: [],
			actors: [],
		}

		const movie = await this.MovieModel.create(defaultValue)
		return movie._id
	}

	async update(_id: string, dto: CreateMovieDto) {
		if (!dto.isSendTelegram) {
			await this.sendNotification(dto)
			dto.isSendTelegram = true
		}
		const updateMovie = await this.MovieModel.findByIdAndUpdate(_id, dto, {
			new: true,
		}).exec()

		if (!updateMovie) {
			throw new NotFoundException('Movie not found')
		}

		return updateMovie
	}

	async delete(id: string) {
		const deleteMovie = await this.MovieModel.findByIdAndDelete(id).exec()

		if (!deleteMovie) {
			throw new NotFoundException('Movie not found')
		}

		return deleteMovie
	}

	async sendNotification(dto: CreateMovieDto) {
		// if (process.env.NODE_ENV !== 'development') {
		// 	await this.TelegramServise.sendPhoto(dto.poster)
		// }

		await this.TelegramServise.sendPhoto(
			'https://www.imdb.com/title/tt0175142/mediaviewer/rm3954579456/?ref_=tt_ov_i'
		)

		const msg = `<b>${dto.title}</b>`

		await this.TelegramServise.sendMessage(msg, {
			reply_markup: {
				inline_keyboard: [
					[
						{
							url: 'https://okko.tv/movie/free-guy',
							text: 'Go to watch',
						},
					],
				],
			},
		})
	}
}
