import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
    @ApiProperty({ example: 'this-will-be-a-token' })
    token: string;

    @ApiProperty({ example: 'new-password123' })
    password: string;
}
