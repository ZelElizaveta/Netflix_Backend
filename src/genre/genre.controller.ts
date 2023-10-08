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
import { GenreService } from './genre.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CreateGenreDto } from './dto/create-genre.dto'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'

@Controller('genres')
export class GenreController {
	constructor(private readonly GenreService: GenreService) {}

	@Get('by-slug/:slug')
	async getProfile(@Param('slug') slug: string) {
		return this.GenreService.bySlug(slug)
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.GenreService.create()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: CreateGenreDto
	) {
		return this.GenreService.update(id, dto)
	}

	@Get('/collections')
	async getCollections() {
		return this.GenreService.getCollections()
	}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.GenreService.getAll(searchTerm)
	}

	@Get(':id')
	@Auth('admin')
	async get(@Param('id', IdValidationPipe) id: string) {
		return this.GenreService.byId(id)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async deleteUser(@Param('id', IdValidationPipe) id: string) {
		return this.GenreService.delete(id)
	}
}
