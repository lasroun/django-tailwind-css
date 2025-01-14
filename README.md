# Installation et Utilisation de Tailwind CSS avec Django

Ce guide décrit les étapes pour intégrer et utiliser Tailwind CSS dans un projet Django.

---

## Prérequis

1. Python (3.7 ou supérieur) et Django installés.
2. Node.js (version LTS) et npm installés.
3. Un projet Django déjà initialisé.

---

## Étape 1 : Création d'un Projet Django

1. Créer un nouvel environnement virtuel :

   ```bash
   python -m venv env
   source env/bin/activate   # Sur Windows : env\Scripts\activate
   ```

2. Installer Django et créer un projet :

   ```bash
   pip install django
   django-admin startproject mon_projet
   cd mon_projet
   ```

3. Démarrer le serveur de développement pour vérifier l'installation :
   ```bash
   python manage.py runserver
   ```
   Accédez à [http://127.0.0.1:8000/](http://127.0.0.1:8000/) pour voir la page par défaut de Django.

---

## Étape 2 : Configuration de l'App et des Templates

1. Créer une application de base :

   ```bash
   python manage.py startapp base
   ```

2. Ajouter l'application `base` dans `INSTALLED_APPS` dans `settings.py` :

   ```python
   INSTALLED_APPS = [
       # ...
       'base',
   ]
   ```

3. Créer un dossier `templates` à la racine du projet et ajouter un fichier `home.html` :

   ```html
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>Accueil</title>
     </head>
     <body>
       <h1>Bienvenue sur la page d'accueil</h1>
     </body>
   </html>
   ```

4. Configurer `TEMPLATES` dans `settings.py` :

   ```python
   import os
   from pathlib import Path

   BASE_DIR = Path(__file__).resolve().parent.parent

   TEMPLATES = [
       {
           'BACKEND': 'django.template.backends.django.DjangoTemplates',
           'DIRS': [BASE_DIR / 'templates'],
           'APP_DIRS': True,
           'OPTIONS': {
               'context_processors': [
                   # ...
               ],
           },
       },
   ]
   ```

5. Ajouter une vue et une route dans `base/views.py` et `urls.py` :

   ```python
   # base/views.py
   from django.shortcuts import render

   def home(request):
       return render(request, 'home.html')
   ```

   ```python
   # mon_projet/urls.py
   from django.contrib import admin
   from django.urls import path
   from base.views import home

   urlpatterns = [
       path('admin/', admin.site.urls),
       path('', home, name='home'),
   ]
   ```

---

## Étape 3 : Installation de Tailwind CSS

1. Initialiser npm dans le répertoire du projet Django :

   ```bash
   npm init -y
   ```

2. Installer Tailwind CSS et ses dépendances :

   ```bash
   npm install -D tailwindcss postcss autoprefixer
   ```

3. Initialiser la configuration de Tailwind :

   ```bash
   npx tailwindcss init -p
   ```

   Cela créera deux fichiers :

   - `tailwind.config.js`
   - `postcss.config.js`

4. Configurer `tailwind.config.js` pour indiquer où chercher les templates :

   ```js
   /** @type {import('tailwindcss').Config} */
   module.exports = {
     content: ["./templates/**/*.{html,js}", "./base/**/*.html"],
     theme: {
       extend: {},
     },
     plugins: [],
   };
   ```

5. Créer un fichier source pour Tailwind dans `static/css/tailwind.css` :

   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

6. Ajouter un script dans `package.json` pour compiler Tailwind :

   ```json
   "scripts": {
       "build:css": "tailwindcss -i ./static/css/tailwind.css -o ./static/css/styles.css --watch"
   }
   ```

7. Compiler le CSS avec :
   ```bash
   npm run build:css
   ```

---

## Étape 4 : Intégrer Tailwind dans les Templates

1. Ajouter une balise `link` dans le fichier `home.html` pour inclure le CSS compilé :

   ```html
   {% load static %}
   <link rel="stylesheet" href="{% static 'css/styles.css' %}" />
   ```

2. Exemple de template modifié avec Tailwind :
   ```html
   {% load static %}
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>Accueil</title>
       <link rel="stylesheet" href="{% static 'css/styles.css' %}" />
     </head>
     <body class="bg-gray-100">
       <h1 class="text-3xl font-bold text-center mt-10">
         Bienvenue sur la page d'accueil
       </h1>
     </body>
   </html>
   ```

---

## Étape 5 : Mise en Production

1. Modifier le script npm pour compiler le CSS en mode production :

   ```json
   "scripts": {
       "build:css:prod": "NODE_ENV=production tailwindcss -i ./static/css/tailwind.css -o ./static/css/styles.css --minify"
   }
   ```

2. Exécuter la compilation en mode production :

   ```bash
   npm run build:css:prod
   ```

3. Configurer Django pour la production dans `settings.py` :

   ```python
   DEBUG = False
   ALLOWED_HOSTS = ['example.com']

   STATIC_URL = '/static/'
   STATIC_ROOT = BASE_DIR / 'staticfiles'
   ```

4. Collecter les fichiers statiques :

   ```bash
   python manage.py collectstatic
   ```

5. Configurer un serveur web (Nginx/Apache) pour servir les fichiers statiques depuis `STATIC_ROOT`.

---