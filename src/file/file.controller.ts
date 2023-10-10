import {
	Controller,
	HttpCode,
	Post,
	Query,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { FileService } from './file.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { FileResponse } from './file.interface'

@Controller('files')
export class FileController {
	constructor(private readonly filesService: FileService) {}

	@Post()
	@HttpCode(200)
	@Auth('admin')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(
		@UploadedFile() file: Express.Multer.File,
		@Query('folder') folder?: string
	): Promise<FileResponse[]> {
		return this.filesService.saveFiles([file], folder)
	}
}
