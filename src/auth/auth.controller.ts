import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	/**
	 * 	Register new user
	 */
	@ApiCreatedResponse({ description: 'Register new user' })
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Post('register')
	register(@Body() dto: AuthDto) {
		return this.authService.register(dto);
	}
	/**
	 * 	Login user
	 */
	@ApiCreatedResponse({ description: 'Login user' })
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	login(@Body() dto: AuthDto) {
		return this.authService.login(dto);
	}
	/**
	 * 	Update token
	 */
	@ApiCreatedResponse({ description: 'Update token' })
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login/access-token')
	getNewTokens(@Body() dto: RefreshTokenDto) {
		return this.authService.getNewTokens(dto.refreshToken);
	}
}
