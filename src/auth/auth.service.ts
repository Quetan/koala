import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService
	) {}

	/**
	 * Авторизация
	 */
	async login(dto: AuthDto) {
		const user = await this.validateUser(dto);
		const tokens = await this.createTokens(user.id);

		return {
			user: this.returnUserFields(user),
			...tokens
		};
	}

	/**
	 * Регистрация
	 */
	async register(dto: AuthDto) {
		const isExists = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		});
		if (isExists) throw new BadRequestException('Пользователь уже существует!');

		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				password: await hash(dto.password)
			}
		});
		const tokens = await this.createTokens(user.id);

		return {
			user: this.returnUserFields(user),
			...tokens
		};
	}

	/**
	 * Создание токенов
	 */
	private async createTokens(userId: number) {
		const data = { id: userId };
		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h'
		});
		const refreshToken = this.jwt.sign(data, {
			expiresIn: '7d'
		});
		return { accessToken, refreshToken };
	}

	/**
	 * Возвращение id и email
	 */
	private returnUserFields(user: User) {
		return {
			id: user.id,
			email: user.email
		};
	}

	/**
	 * Получение новых токенов
	 */
	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken);
		if (!result) throw new UnauthorizedException('Неверный refresh token!');

		const user = await this.prisma.user.findUnique({
			where: {
				id: result.id
			}
		});
		const tokens = await this.createTokens(user.id);

		return {
			user: this.returnUserFields(user),
			...tokens
		};
	}

	/**
	 * Валидация пользователя
	 */
	private async validateUser(dto: AuthDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		});
		if (!user) throw new NotFoundException('Пользователь не существует!');

		const isValid = await verify(user.password, dto.password);
		if (!isValid) throw new UnauthorizedException('Неверный пароль!');

		return user;
	}
}
