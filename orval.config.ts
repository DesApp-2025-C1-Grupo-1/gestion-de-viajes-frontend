import { defineConfig } from 'orval';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    api: {
        input: {
            target: process.env.VITE_API_URL as string,
        },
        output: {
            mode: 'single',
            target: './src/api/generated.ts',
            client: 'react-query'
        },
    },
});