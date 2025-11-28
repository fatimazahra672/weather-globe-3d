# 🌍 Weather Globe 3D - Application Météo Interactive

<div align="center">

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-Latest-000000?style=for-the-badge&logo=three.js&logoColor=white)
![OpenWeather](https://img.shields.io/badge/OpenWeather-API-orange?style=for-the-badge&logo=openweathermap&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)

### 🚀 [**VOIR LE SITE EN LIGNE**](https://weather-globe-3d.vercel.app/) 🚀

*Une application météo moderne avec un globe terrestre 3D interactif, des effets sonores immersifs et des données météorologiques en temps réel.*

</div>

---

## 📋 Table des Matières

- [✨ Fonctionnalités](#-fonctionnalités)
- [🎥 Démonstration](#-démonstration)
- [🛠️ Technologies Utilisées](#️-technologies-utilisées)
- [⚙️ Installation](#️-installation)
- [🚀 Utilisation](#-utilisation)
- [🌐 Déploiement](#-déploiement)
- [📁 Structure du Projet](#-structure-du-projet)
- [🔑 Configuration API](#-configuration-api)
- [🎨 Personnalisation](#-personnalisation)
- [📝 Licence](#-licence)
- [👤 Auteur](#-auteur)

---

## ✨ Fonctionnalités

### 🌐 Globe 3D Interactif
- **Globe terrestre réaliste** avec texture haute résolution
- **Rotation automatique** fluide et personnalisable
- **Interaction au clic** : cliquez n'importe où sur le globe pour obtenir la météo locale
- **Conversion coordonnées** : transformation automatique des coordonnées 3D en latitude/longitude

### ☀️ Données Météo en Temps Réel
- **API OpenWeather** : données météorologiques précises et actualisées
- **Recherche par ville** : trouvez la météo de n'importe quelle ville dans le monde
- **Informations complètes** :
  - 🌡️ Température actuelle (°C)
  - 💧 Humidité (%)
  - 💨 Vitesse du vent (km/h)
  - ☁️ Description météo détaillée
  - 🏙️ Nom de la ville et pays

### 🎵 Effets Sonores Immersifs
- **Sons d'ambiance** adaptés à la météo :
  - 🌿 Sons de nature (ciel dégagé)
  - ☁️ Sons de nuages (temps nuageux)
  - 🌧️ Sons de pluie (temps pluvieux)
- **Contrôle audio** : activation/désactivation des sons

### 🎨 Interface Moderne
- **Design responsive** : fonctionne sur tous les appareils
- **Animations fluides** : transitions et effets visuels
- **Thème spatial** : fond étoilé avec ambiance cosmique
- **Barre de recherche intuitive** avec icône de recherche

---

## 🎥 Démonstration

### 🔗 Lien du Site
**👉 [https://weather-globe-3d.vercel.app/](https://weather-globe-3d.vercel.app/)**

### 📸 Captures d'Écran
*(Ajoutez vos captures d'écran ici)*

---

## 🛠️ Technologies Utilisées

### Frontend
- **React 18.3.1** - Bibliothèque JavaScript pour l'interface utilisateur
- **Three.js** - Bibliothèque 3D pour le rendu du globe terrestre
- **React Three Fiber** - Intégration React pour Three.js

### API & Services
- **OpenWeather API** - Données météorologiques en temps réel
- **Reverse Geocoding** - Conversion coordonnées → ville

### Styling & Assets
- **CSS3** - Animations et styles personnalisés
- **Textures HD** - Images haute résolution pour le globe
- **Audio Files** - Effets sonores d'ambiance

### Déploiement
- **Vercel** - Hébergement et déploiement continu
- **Git** - Contrôle de version

---

## ⚙️ Installation

### Prérequis
- **Node.js** (version 14 ou supérieure)
- **npm** ou **yarn**
- **Clé API OpenWeather** (gratuite)

### Étapes d'Installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/weather-globe-3d.git
cd weather-globe-3d
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer la clé API**
   - Créez un fichier `.env` à la racine du projet
   - Ajoutez votre clé API OpenWeather :
```env
REACT_APP_WEATHER_API_KEY=votre_clé_api_ici
```

4. **Lancer l'application en mode développement**
```bash
npm start
```

5. **Ouvrir dans le navigateur**
   - L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

---

## 🚀 Utilisation

### Rechercher une Ville
1. Tapez le nom d'une ville dans la barre de recherche
2. Cliquez sur l'icône de recherche ou appuyez sur Entrée
3. Les informations météo s'affichent instantanément

### Interagir avec le Globe
1. Cliquez n'importe où sur le globe 3D
2. L'application récupère automatiquement la météo de cet emplacement
3. Les coordonnées sont converties en ville la plus proche

### Contrôler les Sons
- Les sons d'ambiance s'adaptent automatiquement à la météo
- Vous pouvez activer/désactiver les sons selon vos préférences

---

## 🌐 Déploiement

### Déploiement sur Vercel

1. **Créer un compte Vercel** (si nécessaire)
   - Allez sur [vercel.com](https://vercel.com)

2. **Connecter votre repository GitHub**
   - Importez votre projet depuis GitHub

3. **Configurer les variables d'environnement**
   - Ajoutez `REACT_APP_WEATHER_API_KEY` dans les paramètres Vercel

4. **Déployer**
   - Vercel déploie automatiquement à chaque push sur la branche principale

### Build de Production
```bash
npm run build
```
Le dossier `build/` contient les fichiers optimisés pour la production.

---

## 📁 Structure du Projet

```
weather-globe-3d/
├── public/
│   ├── index.html
│   ├── earth_texture.jpg      # Texture du globe terrestre
│   ├── nature_sound.mp3       # Son d'ambiance nature
│   ├── clouds_sound.mp3       # Son d'ambiance nuages
│   └── rain_sound.mp3         # Son d'ambiance pluie
├── src/
│   ├── components/
│   │   ├── Globe.js           # Composant globe 3D
│   │   ├── WeatherInfo.js     # Affichage des données météo
│   │   └── SearchBar.js       # Barre de recherche
│   ├── App.js                 # Composant principal
│   ├── App.css                # Styles globaux
│   └── index.js               # Point d'entrée
├── .env                       # Variables d'environnement (à créer)
├── package.json
└── README.md
```

---

## 🔑 Configuration API

### Obtenir une Clé API OpenWeather

1. **Créer un compte** sur [OpenWeather](https://openweathermap.org/)
2. **Générer une clé API** (gratuite)
3. **Ajouter la clé** dans le fichier `.env` :
```env
REACT_APP_WEATHER_API_KEY=votre_clé_api_ici
```

### Limites de l'API Gratuite
- **60 appels/minute**
- **1,000,000 appels/mois**
- Largement suffisant pour un usage personnel

---

## 🎨 Personnalisation

### Modifier la Vitesse de Rotation du Globe
Dans `Globe.js`, ajustez la valeur :
```javascript
mesh.rotation.y += 0.001; // Augmentez pour une rotation plus rapide
```

### Changer la Texture du Globe
Remplacez `earth_texture.jpg` dans le dossier `public/` par votre propre texture.

### Ajouter de Nouveaux Sons
Ajoutez vos fichiers audio dans `public/` et mettez à jour les références dans `App.js`.

---

## 📝 Licence

Ce projet est sous licence **MIT**. Vous êtes libre de l'utiliser, le modifier et le distribuer.

---

## 👤 Auteur

**Fatima Zahra El hamdani**

- 🌐 **Site en ligne** : [https://weather-globe-3d.vercel.app/](https://weather-globe-3d.vercel.app/)
- 💼 **LinkedIn** : [linkedin.com/in/fatima-zahra-el-hamdani-5ab54a296](https://www.linkedin.com/in/fatima-zahra-el-hamdani-5ab54a296/)
- 🐙 **GitHub** : [github.com/fatimazahra672](https://github.com/fatimazahra672)

---

<div align="center">

### ⭐ Si vous aimez ce projet, n'hésitez pas à lui donner une étoile ! ⭐

**Fait avec ❤️ et React**

</div>
