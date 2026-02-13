# 📜 Rules I Live By (Until I Don’t)

## 🧠 Concept
**Rules I Live By (Until I Don’t)** est une application introspective permettant à un utilisateur de définir ses règles personnelles, puis d’enregistrer les moments où il les respecte ou les brise, afin d’observer l’écart entre valeurs déclarées et comportements réels.

L’application ne cherche **ni à corriger**, **ni à conseiller**, **ni à optimiser**.  
Elle sert uniquement de **miroir factuel et émotionnel**.

---

## 👤 Utilisateurs
- Authentification utilisateur (ex : JWT)
- Chaque utilisateur possède ses propres données
- Accès strictement privé (aucune donnée partagée)
- Pas de dimension sociale ou collaborative

---

## 📜 Règles
Une règle représente une **intention personnelle**, pas une obligation.

Attributs principaux :
- Titre
- Description (optionnelle)
- Statut : active / archivée
- Date de création

Une règle peut rester valide même si elle est fréquemment brisée.

---

## 📅 Événements de règle
Un événement correspond à une **occurrence réelle** liée à une règle.

Types :
- `RESPECTED`
- `BROKEN`

Attributs principaux :
- Type d’événement
- Contexte libre (texte court)
- Émotion dominante (optionnelle)
- Note personnelle (optionnelle)
- Date

Une règle peut avoir un nombre illimité d’événements.

---

## 📊 Insights
L’application fournit des **observations factuelles**, sans jugement :

- Règles les plus souvent brisées
- Émotions les plus associées aux ruptures
- Temps moyen avant la première rupture d’une règle
- Règles jamais brisées

Aucune recommandation automatique.  
Aucune évaluation morale.

---

## 🧱 Contraintes de conception
- Données strictement privées
- Aucune gamification
- Aucun score, badge ou objectif
- Ton neutre et non moralisateur
- Interface volontairement minimaliste

---

## 🎨 Intention UX
L’expérience utilisateur doit encourager :
- La lenteur
- La relecture
- L’honnêteté

L’application ne cherche pas à provoquer l’action, mais l’observation.

---

## 🎯 Objectif du projet
Créer un outil simple et sincère permettant à un utilisateur d’observer :

> *Non pas s’il est cohérent, mais quand il ne l’est pas — et dans quelles conditions.*
