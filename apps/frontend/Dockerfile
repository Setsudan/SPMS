# Frontend Dockerfile (apps/frontend/Dockerfile)

# Étape 1 : Builder l'application Angular
FROM node:18-alpine AS build

WORKDIR /app

# Copier les fichiers nécessaires
COPY package.json yarn.lock ./

# Installer les dépendances
RUN yarn install --check-files

# Copier le code source
COPY . .

# Construire l'application Angular
RUN yarn build

# Étape 2 : Servir avec Nginx
FROM nginx:alpine

# Copier les fichiers construits dans Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le port de Nginx
EXPOSE 80

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]
