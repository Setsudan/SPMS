FROM node:18-alpine

# Créer le répertoire de travail pour le monorepo complet
WORKDIR /app

# Copier les fichiers de configuration du monorepo
COPY ../../package.json ../../yarn.lock ./
COPY ../../turbo.json ./

# Copier le dossier apps
COPY ../../apps ./apps/

# Installer les dépendances à la racine
RUN yarn install

# Se positionner dans le dossier backend
WORKDIR /app/apps/backend

# Exposer le port
EXPOSE 3000

# Les commandes seront exécutées depuis la racine du monorepo
CMD ["sh", "-c", "cd /app && yarn workspace backend prisma migrate dev --name init && yarn turbo dev"]