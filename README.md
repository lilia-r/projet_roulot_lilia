# SYS.POLLUTION // 2077 — Registre de Signalements Environnementaux

Application web développée avec **Angular 22** permettant de déclarer, filtrer, consulter et gérer des observations de pollution environnementale, habillée d'une interface **Cyberpunk HUD** (grille laser interactive, verre dépoli et fiches de télémétrie).

---

## Fonctionnalités principales

- **Authentification & Accès sécurisé (`/signup`)** :
  - Inscription d'opérateur via la route backend `POST /api/signup` (validation et enregistrement en base PostgreSQL).
  - *Note TP* : la persistance de session côté frontend repose volontairement sur `localStorage` (`user_session`) sans jeton JWT afin de rester dans le périmètre du TP.
  - Barre supérieure persistante affichant l'état de la session en temps réel et permettant la déconnexion sécurisée.
- **Protection des routes (`Guards` fonctionnels)** :
  - **`AuthGuard`** : restreint l'accès au registre (`/pollutions`) aux utilisateurs connectés et redirige automatiquement vers `/signup` si aucune session n'est active.
  - **`UnsavedChangesGuard`** : intercepte la navigation ou la déconnexion lorsqu'un signalement est en cours de saisie afin d'éviter toute perte de données.
- **Registre des pollutions (`/pollutions`)** :
  - **Déclaration** : formulaire complet (titre, type de pollution, indice de dangerosité `0–101+`, lieu, date d'observation, description).
  - **Filtrage dynamique** : recherche instantanée par mot-clé (titre ou lieu) et filtrage par catégorie (`Déchets`, `Plastique`, `Air`, `Eau`, `Chimique`, `Industriel`).
  - **Fiche dossier télémétrique** : modale détaillée avec jauge visuelle de dangerosité, bannière contextuelle et rapport d'analyse terrain.
  - **Suppression** : retrait immédiat d'un signalement depuis l'historique.
- **Interface & Performance** :
  - **Standalone Components** chargés en **Lazy Loading** (`loadComponent`).
  - Détection de changements optimisée (`ChangeDetectionStrategy.OnPush`).
  - Directives et pipes personnalisés (`CyberRevealDirective`, `HighlightPollutionDirective`, `PollutionLevelPipe`).
  - Arrière-plan interactif réagissant aux mouvements du curseur.

---

## Stack technique

- **Framework** : Angular 22 (Standalone Components, TypeScript)
- **Styles** : SCSS (variables, `@use 'sass:color'`, `clip-path`, `backdrop-filter`, CSS Grid/Flexbox)
- **Polices** : _Chakra Petch_ & _Rajdhani_ (Google Fonts)
- **Tests unitaires** : Vitest

---

## Structure du projet

```text
Front/
└── src/
    ├── app/
    │   ├── components/
    │   │   └── pollution/        # Page principale : formulaire, liste filtrable et modale dossier
    │   ├── core/
    │   │   └── guards/           # AuthGuard & UnsavedChangesGuard
    │   ├── models/               # Interfaces TypeScript (Pollution)
    │   ├── services/             # PollutionService (appels HTTP & normalisation)
    │   ├── shared/
    │   │   ├── directives/       # Animations d'apparition et mise en valeur selon la dangerosité
    │   │   └── pipes/            # Conversion du score numérique en niveau de gravité
    │   ├── signup/               # Écran d'authentification / inscription
    │   ├── app.ts / .html / .scss # Shell global, Topbar HUD et arrière-plan laser
    │   └── app.routes.ts         # Configuration du routage et Lazy Loading
    └── styles.scss               # Reset global, scrollbar sombre et thèmes visuels par pollution
```
