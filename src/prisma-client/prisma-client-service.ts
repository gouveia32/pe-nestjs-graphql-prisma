
import {PrismaClient} from '@prisma/client';
export const PrismaClientService = {
    provide: PrismaClient,
    useClass: PrismaClient
}