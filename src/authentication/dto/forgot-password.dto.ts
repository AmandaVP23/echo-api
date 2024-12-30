import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
    @ApiProperty({ example: 'peter@email.com' })
    emailOrUsername: string;
}
