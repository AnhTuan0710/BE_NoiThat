import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { Column, Entity } from "typeorm";
export class UpdateUserDto {
  @Column()
  name?: string
  @Column()
  address?: string
  @Column()
  phone_no?: string
  @Column()
  password?: string
}

export class LoginDto {
  @Column()
  @ApiProperty({
    description: 'email',
    example: 'anhtuan@gmail.com',
  })

  email: string;
  @Column()
  @ApiProperty({
    description: 'password',
    example: '123456',
  })
  password: string;

  @Column()
  @ApiProperty({
    description: 'role',
    example: 'admin',
  })
  role: string;
};

@Entity('users')
export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'email',
    example: 'anhtuan@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'name',
    example: 'Anh Tuan',
  })
  name: string;

  @ApiProperty({
    description: 'role',
    example: 'admin',
    default:"admin"
  })
  role: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'password',
    example: '123456',
  })
  password: string;
}

export class ChangePasswordDto {
  @Column()
  @ApiProperty({
    description: 'email',
    example: 'anhtuan@gmail.com',
  })
  email: string;

  @Column()
  @ApiProperty({
    description: 'password_old',
    example: '123456',
  })
  password_old: string;

  @Column()
  @ApiProperty({
    description: 'password_new',
    example: '123123',
  })
  password_new: string;
}