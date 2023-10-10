import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'

import { MovieModel } from './movie.model'
import { CreateMovieDto } from './dto/create-movie.dto'
import { Types } from 'mongoose'

@Injectable()
export class MovieService {
	constructor(
		@InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>
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
}
