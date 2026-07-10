---
theme: default
title: Ingénierie des Infrastructures Web & Cloud — Validation du sujet
slug: fyc-validation
event: FYC
date: 2026-07-10
lang: fr
description: Pitch de validation du sujet de la formation Ingénierie des Infrastructures Web & Cloud.
status: ready
tags:
  - web
  - cloud
  - infrastructure
  - formation
links: {}
template: conference
highlighter: shiki
css: unocss
colorSchema: light
transition: fade-out
mdc: true
fonts:
  sans: DM Sans
  serif: Bodoni Moda
layout: cover
glowSeed: fyc-validation
---

<div text-sm op50 tracking-widest uppercase mb-4>Proposition de formation · Validation du sujet</div>

# Ingénierie des Infrastructures<br>Web & Cloud

<div op50 text-xl mt-4>
Du navigateur au cloud — comprendre, déployer, automatiser.
</div>

<div mt-10 flex="~ gap-2 wrap">
  <div class="chip"><div i-ph-globe-duotone text-blue-600 /> DNS</div>
  <div class="chip"><div i-logos-docker-icon /> Docker</div>
  <div class="chip"><div i-logos-kubernetes /> Kubernetes</div>
  <div class="chip"><div i-ph-cloud-duotone text-sky-600 /> Cloud</div>
  <div class="chip"><div i-logos-argo-icon /> GitOps</div>
</div>

<!--
Bonjour. Je viens vous présenter un sujet de formation : « Ingénierie des Infrastructures Web & Cloud ».

L'idée en une phrase : suivre une application web du navigateur jusqu'au cloud — d'abord comprendre ce qui se passe, puis déployer, puis automatiser.

Les mots-clés en bas donnent le périmètre : DNS, Docker, Kubernetes, cloud public et GitOps. L'objectif aujourd'hui n'est pas de rentrer dans le contenu, mais de valider le sujet, le problème qu'il adresse et son découpage.
-->

---
layout: center
glow: bottom
class: text-center
---

<div op50 text-lg mb-6>Le constat</div>

<div text-4xl leading-relaxed>
Les développeurs savent construire une application,<br>rarement l'<span text-rose-600>opérer</span>
</div>

<div op50 text-xl mt-8 v-click>
Une application ne vit pas seule dans un git repo :<br>elle dépend de couches qu'il faut comprendre pour déployer,<br>diagnostiquer et faire évoluer un service.
</div>

<!--
Le point de départ, c'est un constat simple : les cursus de développement forment très bien à construire des applications — code, frameworks, bases de données — mais beaucoup moins à les faire tourner en conditions réelles.

[click] Or une application ne vit pas seule dans un dépôt Git. Entre le code et l'utilisateur, il y a toute une pile : réseau, serveurs, conteneurs, certificats… Tant qu'on ne comprend pas ces couches, on ne sait ni déployer sereinement, ni diagnostiquer une panne, ni faire évoluer le service.

C'est ce manque que la formation vient combler.
-->

---
layout: center
glow: top
class: text-center
---

<div op50 text-lg mb-6>Le problème auquel répond la formation</div>

<div text-3xl font-mono>« ça tourne sur ma machine »</div>

<div mt-8 flex="~ gap-3 items-center justify-center" text-2xl>
  <div i-ph-arrow-down-duotone op30 />
</div>

<div text-3xl v-click>un service <span text-lime-600>déployé</span>, <span text-amber-600>disponible</span> et <span text-purple-600>automatisé</span></div>

<div op50 text-lg mt-10 v-click>
Combler le fossé entre le code applicatif et l'infrastructure qui le fait vivre.
</div>

<!--
Le problème que la formation adresse tient dans cette phrase que tout le monde a déjà entendue : « ça tourne sur ma machine ».

[click] L'objectif, c'est le trajet entre cette phrase et un vrai service : déployé quelque part, disponible même en cas de panne, et automatisé pour que chaque mise à jour ne soit pas une opération à risque.

[click] Autrement dit : combler le fossé entre le code applicatif — que les étudiants maîtrisent déjà — et l'infrastructure qui le fait vivre. C'est exactement le périmètre du cours, ni plus, ni moins.
-->

---
class: text-2xl
glow: right
---

# Le cours en un coup d'œil

<div grid="~ cols-[max-content_min-content_auto] items-center gap-x-10 gap-y-10" py10>
  <div flex="~ gap-2 items-center" text-blue-600 v-click>
    <div i-ph-magnifying-glass-duotone text-2xl />
    <span>Comprendre</span>
  </div>
  <div i-ph-arrow-right-duotone op50 v-click />
  <div text-lg op75 v-after>le cheminement complet d'une requête web</div>

  <div flex="~ gap-2 items-center" text-lime-600 v-click>
    <div i-ph-rocket-launch-duotone text-2xl />
    <span>Déployer</span>
  </div>
  <div i-ph-arrow-right-duotone op50 v-click />
  <div text-lg op75 v-after>du VPS aux conteneurs, jusqu'au cloud managé</div>

  <div flex="~ gap-2 items-center" text-purple-600 v-click>
    <div i-ph-arrows-clockwise-duotone text-2xl />
    <span>Automatiser</span>
  </div>
  <div i-ph-arrow-right-duotone op50 v-click />
  <div text-lg op75 v-after>des déploiements reproductibles, pilotés par Git</div>
</div>

<div op50 text-lg v-click>Format : 5 modules · ~13 heures · théorie + travaux pratiques.</div>

<!--
Le cours s'articule autour de trois verbes.

[click] D'abord **comprendre** : [click] suivre le cheminement complet d'une requête web, du navigateur jusqu'à la base de données. C'est le socle — sans ça, le reste est de la recette de cuisine.

[click] Ensuite **déployer** : [click] faire tourner l'application sur de vraies machines, en montant en complexité — VPS, conteneurs, puis cloud managé.

[click] Enfin **automatiser** : [click] arriver à des déploiements reproductibles, pilotés par Git, comme en production dans l'industrie.

[click] Côté format : cinq modules, environ treize heures au total, avec à chaque fois de la théorie et des travaux pratiques.
-->

---
glow: left
---

# Les cinq modules

<div flex="~ col gap-6" mt-10 text-xl>
  <div flex="~ gap-4 items-center" v-click>
    <div i-ph-number-circle-one-duotone text-blue-600 text-3xl flex-none />
    <div>Fondations réseau <span op50 text-base ml-2>DNS, HTTP, reverse proxy · ~2h</span></div>
  </div>
  <div flex="~ gap-4 items-center" v-click>
    <div i-ph-number-circle-two-duotone text-lime-600 text-3xl flex-none />
    <div>Hébergement & conteneurs <span op50 text-base ml-2>VPS, Docker, Compose · ~3h</span></div>
  </div>
  <div flex="~ gap-4 items-center" v-click>
    <div i-ph-number-circle-three-duotone text-amber-600 text-3xl flex-none />
    <div>Haute disponibilité <span op50 text-base ml-2>Swarm, Kubernetes · ~3h</span></div>
  </div>
  <div flex="~ gap-4 items-center" v-click>
    <div i-ph-number-circle-four-duotone text-purple-600 text-3xl flex-none />
    <div>Cloud public <span op50 text-base ml-2>stockage, auto-scaling, bases de données · ~3h</span></div>
  </div>
  <div flex="~ gap-4 items-center" v-click>
    <div i-ph-number-circle-five-duotone text-rose-600 text-3xl flex-none />
    <div>Automatisation & GitOps <span op50 text-base ml-2>Terraform, Ansible, ArgoCD · ~2h</span></div>
  </div>
</div>

<!--
Voici le découpage en cinq modules. Je les donne rapidement, sans détailler — le contenu précis est prêt, on pourra y revenir en questions.

[click] Module 1, les fondations réseau : DNS, HTTP, reverse proxy — l'anatomie d'une requête web. Environ deux heures.

[click] Module 2, hébergement et conteneurs : où faire tourner l'application, et comment Docker isole les dépendances. Trois heures.

[click] Module 3, haute disponibilité : pourquoi un seul serveur ne suffit pas, et la réponse des orchestrateurs, jusqu'à Kubernetes. Trois heures.

[click] Module 4, cloud public : le catalogue de ressources managées — stockage, auto-scaling, bases de données. Trois heures.

[click] Module 5, automatisation et GitOps : l'infrastructure décrite par le code, avec Terraform, Ansible et ArgoCD. Deux heures.

La progression est volontaire : chaque module s'appuie sur les limites du précédent.
-->

---
layout: center
glow: bottom
class: text-center
---

<div op50 text-lg mb-2>L'approche pédagogique</div>

<div text-4xl>Une application, <span class="module-word" text-rose-600>quatre</span> déploiements</div>

<div mt-10 flex="~ gap-3 items-center justify-center wrap" text-lg>
  <div class="chip" v-click="1"><div i-logos-docker-icon /> Local</div>
  <div i-ph-arrow-right-duotone op30 v-click="2" />
  <div class="chip" v-click="2"><div i-logos-nginx /> VPS</div>
  <div i-ph-arrow-right-duotone op30 v-click="3" />
  <div class="chip" v-click="3"><div i-logos-kubernetes /> K8s local</div>
  <div i-ph-arrow-right-duotone op30 v-click="4" />
  <div class="chip" v-click="4"><div i-ph-cloud-check-duotone text-purple-600 /> Cloud managé</div>
</div>

<div op50 text-lg mt-10 v-click>
Pas de théorie hors sol : les limites de chaque étape motivent la suivante.
</div>

<!--
Un mot sur la pédagogie, parce que c'est le cœur de la proposition : un fil rouge unique. La même application — une API avec sa base de données — est déployée quatre fois au fil des TP.

[click] D'abord en local avec Docker Compose, [click] puis sur un VPS avec un reverse proxy configuré à la main, [click] puis sur un Kubernetes local, [click] et enfin sur un Kubernetes managé dans le cloud.

[click] L'intérêt : pas de théorie hors sol. À chaque étape, les étudiants constatent eux-mêmes les limites — panne du serveur, mise à jour qui coupe le service — et c'est ce constat qui motive l'étape suivante. Chaque notion est reliée à un déploiement observable.
-->

---
layout: center
glow: right
class: text-center
---

<div op50 text-lg mb-8>Ce que la formation apporte</div>

<div flex="~ col gap-5 items-start" text-2xl mx-auto w-max>
  <div v-click>du navigateur <span op30>→</span> au serveur</div>
  <div v-click>du processus <span op30>→</span> au conteneur</div>
  <div v-click>du VPS <span op30>→</span> au cluster</div>
  <div v-click>du manuel <span op30>→</span> au GitOps</div>
</div>

<div op50 text-xl mt-12 v-click>
Un socle complet pour rendre un développeur<br>autonome sur l'infrastructure de ses applications.
</div>

<!--
Pour résumer ce que la formation apporte, quatre progressions :

[click] du navigateur au serveur — comprendre le trajet d'une requête ;

[click] du processus au conteneur — packager proprement une application ;

[click] du VPS au cluster — concevoir une infrastructure qui résiste aux pannes ;

[click] et du manuel au GitOps — automatiser pour que les déploiements soient reproductibles.

[click] En une phrase : un socle complet pour rendre un développeur autonome sur l'infrastructure de ses applications. C'est le sujet que je vous propose de valider.
-->

---
layout: center
glow: top
class: text-center
---

<h1 class="module-word" important-text-3em>Merci</h1>

<div op50 mt-4>Ingénierie des Infrastructures Web & Cloud — Validation du sujet</div>

<!--
Merci de votre attention. Je suis preneur de vos questions — sur le périmètre, le volume horaire, les prérequis ou le détail des modules, dont le contenu complet est déjà rédigé.
-->

