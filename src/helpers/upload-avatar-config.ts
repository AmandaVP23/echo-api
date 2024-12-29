import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';
import { diskStorage, memoryStorage } from 'multer';
import { Request } from 'express';
import * as fs from 'fs';

export const avatarUploadMulterOptions = {
    // storage: diskStorage({
    //     destination: (
    //         req: Request,
    //         file: Express.Multer.File,
    //         cb: (error: Error | null, destination: string) => void,
    //     ) => {
    //         const uploadPath = './storage/avatars'; // Define your dynamic directory path

    //         // Check if the directory exists, and create it if not
    //         if (!fs.existsSync(uploadPath)) {
    //             fs.mkdirSync(uploadPath, { recursive: true });
    //         }

    //         cb(null, uploadPath); // Set the upload destination
    //     },
    //     filename: (
    //         req: Request,
    //         file: Express.Multer.File,
    //         cb: (error: Error | null, filename: string) => void,
    //     ) => {
    //         const uniqueSuffix =
    //             Date.now() + '-' + Math.round(Math.random() * 1e9);

    //         const fileExtension = extname(file.originalname);

    //         console.log('file', file.fieldname);
    //         console.log('uniqueSuffix', uniqueSuffix);
    //         cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
    //     },
    // }),
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
