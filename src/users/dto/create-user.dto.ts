import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'Peter Parker' })
    name: string;

    @ApiProperty({ example: 'peter@email.com' })
    email: string;

    @ApiProperty({ example: 'peter.parker' })
    username: string;

    @ApiProperty({ example: 'spiderman123' })
    password: string;
}
