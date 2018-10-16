import { IsOptional, Length, MaxLength, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @MaxLength(30)
  readonly firstName: string;
  @IsOptional()
  @MaxLength(30)
  readonly lastName: string;
  @IsEmail()
  readonly email: string;
  @Length(8, 32)
  password: string;
}
