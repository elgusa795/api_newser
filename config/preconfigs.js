import dotenv from 'dotenv';
dotenv.config({ path: '../variables.env' });

const TOKEN=process.env.TOKEN || "6070458680:AAFEq6TDwmPkvgeKydIJJZ81BkFZZ8EFzPw";
const ORIGIN_URL=process.env.ORIGIN_URL || "*";
const CHAT_ID=process.env.CHAT_ID || "1660900306";

const PORT= process.env.PORT || 8080;
const HOST= process.env.HOST || '(HOST NO SETEADO)';

export {TOKEN, ORIGIN_URL, CHAT_ID, PORT, HOST}