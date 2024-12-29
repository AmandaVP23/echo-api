import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';
import { Request } from 'express';

export const avatarUploadMulterOptions = {
    storage: memoryStorage(),
    fileFilter: (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, acceptFile: boolean) => void,
    ) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
            cb(new BadRequestException('Invalid file type'), false);
        } else {
            cb(null, true);
        }
    },
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit
    },
};
