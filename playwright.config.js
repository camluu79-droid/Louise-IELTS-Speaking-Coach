import {defineConfig} from '@playwright/test';
import {existsSync} from 'node:fs';
const executablePath = process.env.CHROMIUM_PATH || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
export default defineConfig({testDir:'./tests', testMatch:'*.spec.js', use:{baseURL:'http://127.0.0.1:3000',launchOptions:{executablePath,args:['--no-sandbox','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']},permissions:['microphone']},webServer:{command:'npm start',url:'http://127.0.0.1:3000',reuseExistingServer:false},reporter:'list'});
