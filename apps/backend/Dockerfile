# Backend Dockerfile (apps/backend/Dockerfile)
FROM node:18-alpine

WORKDIR /app

# Copier les fichiers nécessaires pour installer les dépendances
COPY package.json yarn.lock ./

# Installer les dépendances
RUN yarn install --check-files

# Copier le reste des fichiers
COPY . .

# Générer Prisma Client
RUN yarn prisma generate

# Compiler le projet TypeScript
RUN yarn build

# Exposer le port de l'application
EXPOSE 3000

# Lancer les migrations Prisma, puis démarrer l'application
CMD ["sh", "-c", "yarn prisma migrate dev && node dist/server.js"]
