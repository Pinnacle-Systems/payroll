import {
  get as _get,
  addAbsentPunches as _addAbsentPunches,
  updatePermissionPunches as _updatePermissionPunches

} from "../services/AttendenceGeneration.service.js";
import { Prisma } from '@prisma/client'

async function get(req, res, next) {
  try {
    res.json(await _get(req.query));
    console.log(res.statusCode);
  } catch (err) {
    console.error(`Error `, err.message);
  }
}

async function addAbsentPunches(req, res, next) {
  try {
    res.json(await _addAbsentPunches(req.body));
    console.log(res.statusCode);
  } catch (error) {
    console.error(`Error`, error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        res.statusCode = 200;
        res.json({ statusCode: 1, message: `${error.meta.target.split("_")[1].toUpperCase()} Already exists` })
        console.log(res.statusCode)
      }
    } else {
      res.json({ statusCode: 1, message: error.message })
    }
  }
}
async function updatePermissionPunches(req, res, next) {
  try {
    res.json(await _updatePermissionPunches(req.body));
    console.log(res.statusCode);
  } catch (error) {
    console.error(`Error`, error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        res.statusCode = 200;
        res.json({ statusCode: 1, message: `${error.meta.target.split("_")[1].toUpperCase()} Already exists` })
        console.log(res.statusCode)
      }
    } else {
      res.json({ statusCode: 1, message: error.message })
    }
  }
}

export { get, addAbsentPunches,updatePermissionPunches };
