import { Telegram } from 'src/telegram/telegram.interface'

export const getTelegramConfig = (): Telegram => ({
	chatId: '759891906',
	token: process.env.TELEGRAM_BOT_TOKEN,
})
