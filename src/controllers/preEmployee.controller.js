import { Prisma } from '@prisma/client'
import { get as _get, create as _create} from '../services/preEmployee.service.js';

async function get(req, res, next) {
    try {
        res.json(await _get(req));
            console.log("Backend get called"); 
        console.log(res.statusCode);
    } catch (err) {
        console.error(`Error `, err.message);
    }
}


async function create(req, res, next) {
    try {
        res.json(await _create(req));
        console.log(res.statusCode);
    } catch (error) {
        console.error(`Error`, error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                res.statusCode = 200;
                res.json({ statusCode: 1, message: `${error.meta.target.split("_")[1].toUpperCase()} Already exists` })
                console.log(res.statusCode)
            }
        }
    }
}



export {
    get,
   
    create,
   
};
