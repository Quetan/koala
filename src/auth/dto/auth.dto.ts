import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthDto {
	/**
	 * Email address
	 * @example quetan@vk.com
	 **/
	@IsEmail()
	email: string;

	/**
	 * Password
	 **/
	@MinLength(6, {
		message: 'Пароль должен состоять хотя бы из 6 символов'
	})
	@IsString()
	password: string;
}
