import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'

import { GenreController } from './genre.controller'
import { GenreService } from './genre.service'
import { GenreModel } from './genre.model'

@Module({
	controllers: [GenreController],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: GenreModel,
				schemaOptions: {
					collection: 'Genre',
				},
			},
		]),
	],
	providers: [GenreService],
})
export class GenreModule {}
