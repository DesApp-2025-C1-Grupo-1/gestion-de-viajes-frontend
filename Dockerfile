# Build
FROM node:18-bullseye-slim AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./

RUN if [ -f package-lock.json ]; then npm ci --silent; else npm install --silent; fi

COPY . .
RUN npm run build

# Runner
FROM node:18-bullseye-slim AS production

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./

RUN if [ -f package-lock.json ]; then npm ci --omit=dev --silent; else npm install --omit=dev --silent; fi \
	&& npm install -g serve --silent

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 80

CMD ["serve", "-s", "dist", "-l", "80"]
