import * as config from 'config';

export const APP_URL = {
  ADMIN_URL: config.get<string>('app.url.admin'),
}

export const MAIL_CONFIG = {
  HOST: config.get<string>('mail_config.host'),
  PORT: config.get<number>('mail_config.port'),
  USER: config.get<string>('mail_config.user'),
  PASS: config.get<string>('mail_config.pass'),
  FROM: config.get<string>('mail_config.from'),
  SECURE: config.get<boolean>('mail_config.secure'),
};

export const DATABASE = {
  TYPE: config.get<string>('database.type'),
  HOST: config.get<string>('database.host'),
  PORT: config.get<number>('database.port'),
  USER_NAME: config.get<string>('database.username'),
  PASSWORD: config.get<string>('database.password'),
  DATABASE: config.get<string>('database.database'),
}