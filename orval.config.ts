import { defineConfig } from 'orval';

export default defineConfig({
    api: {
        input: {
            target: 'process.env.VITE_API_URL' as string,
        },
        output: {
            mode: 'single',
            target: './src/api/generated.ts',
            client: 'react-query'
        },
    },
});