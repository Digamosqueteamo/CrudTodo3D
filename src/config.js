/*export const PORT = process.env.PORT || 3001;

export const DB_HOST = process.env.DB_HOST || 'monorail.proxy.rlwy.net';
export const DB_USER = process.env.DB_USER || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'DFHFC6Ch2A5d4EAEaea-eAA155C1fCb4';
export const DB_NAME = process.env.DB_NAME || 'railway';
export const DB_PORT = process.env.DB_PORT || '45424';*/

const PORT = process.env.PORT || 3001;
exports.PORT = PORT;

const DB_HOST = process.env.DB_HOST || 'monorail.proxy.rlwy.net';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'DFHFC6Ch2A5d4EAEaea-eAA155C1fCb4';
const DB_NAME = process.env.DB_NAME || 'railway';
const DB_PORT = process.env.DB_PORT || '45424';

exports.DB_HOST = DB_HOST;
exports.DB_USER = DB_USER;
exports.DB_PASSWORD = DB_PASSWORD;
exports.DB_NAME = DB_NAME;
exports.DB_PORT = DB_PORT;