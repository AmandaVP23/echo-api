import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: 'peter@email.com' })
    emailOrUsername: string;

    @ApiProperty({ example: 'spiderman123' })
    password: string;
}
