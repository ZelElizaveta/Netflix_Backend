import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { ConfigModule } from '@nestjs/config'
import { UserModel } from './user.model'
import { TypegooseModule } from 'nestjs-typegoose'

@Module({
	controllers: [UserController],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: UserModel,
				schemaOptions: {
					collection: 'User',
				},
			},
		]),
		ConfigModule,
	],
	providers: [UserService],
})
export class UserModule {}
