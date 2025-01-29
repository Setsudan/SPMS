# Étape 1 : Builder l'application Angular
FROM node:18-alpine AS build

WORKDIR /app

# Copier d'abord package.json et yarn.lock
COPY ../../package.json ../../yarn.lock ./
COPY ../../apps/frontend/package.json ./apps/frontend/

# Installer les dépendances
RUN yarn install

# Copier le reste du code source
COPY ../../apps/frontend ./apps/frontend/

# Se déplacer dans le dossier frontend
WORKDIR /app/apps/frontend

# Installer @angular/cli globalement
RUN yarn global add @angular/cli

# Construire l'application
RUN yarn build

# Étape 2 : Servir avec Nginx
FROM nginx:alpine

# Copier les fichiers construits dans Nginx
COPY --from=build /app/apps/frontend/dist/* /usr/share/nginx/html/

# Exposer le port de Nginx
EXPOSE 80

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]