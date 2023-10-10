import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { MovieService } from './movie.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { CreateMovieDto } from './dto/create-movie.dto'
import { Types } from 'mongoose'

@Controller('movies')
export class MovieController {
	constructor(private readonly movieService: MovieService) {}

	@Get('by-slug/:slug')
	async BySlug(@Param('slug') slug: string) {
		return this.movieService.bySlug(slug)
	}

	@Get('by-actor/:actorId')
	async ByActorId(@Param('actorId', IdValidationPipe) actorId: Types.ObjectId) {
		return this.movieService.byActor(actorId)
	}

	@Post('by-genres')
	@HttpCode(200)
	async byGenres(
		@Body('genreIds')
		genreIds: Types.ObjectId[]
	) {
		return this.movieService.byGenres(genreIds)
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.movieService.create()
	}

	@Put('update-count-opened')
	@HttpCode(200)
	async updateCountOpened(@Body('slug') slug: string) {
		return this.movieService.updateCountOpened(slug)
	}

	@Get('/collections')
	async getCollections() {
		return this.movieService.getCollections()
	}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.movieService.getAll(searchTerm)
	}

	@Get('most-popular')
	async getMostPopular() {
		return this.movieService.getMostPopular()
	}

	@Get(':id')
	@Auth('admin')
	async get(@Param('id', IdValidationPipe) id: string) {
		return this.movieService.byId(id)
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: CreateMovieDto
	) {
		return this.movieService.update(id, dto)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async deleteUser(@Param('id', IdValidationPipe) id: string) {
		return this.movieService.delete(id)
	}
}
