import { defineConfig } from 'orval';

export default defineConfig({
    api: {
        input: {
            target: 'http://localhost:3000/api-json',
        },
        output: {
            mode: 'single',
            target: './src/api/generated.ts',
            client: 'axios',
        },
    },
});