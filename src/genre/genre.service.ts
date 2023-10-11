import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'

import { GenreModel } from './genre.model'
import { CreateGenreDto } from './dto/create-genre.dto'
import { MovieService } from 'src/movie/movie.service'
import { Collection } from './genre.interface'

@Injectable()
export class GenreService {
	constructor(
		@InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>,
		private readonly MovieService: MovieService
	) {}

	async bySlug(slug: string) {
		const genre = await this.GenreModel.findOne({ slug }).exec()
		if (!genre) {
			throw new NotFoundException('Genre not found')
		}

		return genre
	}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{
						name: new RegExp(searchTerm, 'i'),
					},
					{
						slug: new RegExp(searchTerm, 'i'),
					},
					{
						description: new RegExp(searchTerm, 'i'),
					},
				],
			}
		}

		return this.GenreModel.find(options)
			.select('-updatedAt -__v')
			.sort({
				createdAt: 'desc',
			})
			.exec()
	}

	async getCount() {
		return this.GenreModel.find().count().exec()
	}

	async getCollections(): Promise<Collection[]> {
		const genres = await this.getAll()

		const collections = await Promise.all(
			genres.map(async (genre) => {
				const moviesByGenre = await this.MovieService.byGenres([genre._id])
				let image = 'default_image.jpg'

				if (moviesByGenre.length > 0) {
					image = moviesByGenre[0].bigPoster
				}

				const result: Collection = await {
					_id: String(genre._id),
					title: genre.name,
					slug: genre.slug,
					image,
				}
				return result
			})
		)

		return collections
	}

	// Admin
	async byId(_id: string) {
		const genre = await this.GenreModel.findById(_id)

		if (!genre) {
			throw new NotFoundException('Genre not found')
		}
		return genre
	}

	async create() {
		const defaultValue: CreateGenreDto = {
			name: '',
			description: '',
			slug: '',
			icon: '',
		}

		const genre = await this.GenreModel.create(defaultValue)
		return genre._id
	}

	async update(_id: string, dto: CreateGenreDto) {
		const updateGenre = await this.GenreModel.findByIdAndUpdate(_id, dto, {
			new: true,
		}).exec()

		if (!updateGenre) {
			throw new NotFoundException('Genre not found')
		}

		return updateGenre
	}

	async delete(id: string) {
		const deleteGenre = await this.GenreModel.findByIdAndDelete(id).exec()

		if (!deleteGenre) {
			throw new NotFoundException('Genre not found')
		}

		return deleteGenre
	}
}
