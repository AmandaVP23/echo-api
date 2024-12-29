import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
    @ApiProperty({ example: 'refresh-token' })
    refreshToken: string;
}
