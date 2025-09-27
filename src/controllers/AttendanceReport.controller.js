import {
  get as _get,

} from "../services/AttendenceReport.service.js";

async function get(req, res, next) {
  try {
    res.json(await _get(req.query));
    console.log(res.statusCode);
  } catch (err) {
    console.error(`Error `, err.message);
  }
}

export { get };
