---
theme: default
title: Losyma — architecture d’un webmail Symfony
slug: losyma
event: Framework Symfony · ESGI 4
date: 2026-07-29
lang: fr
description: Architecture technique d’un webmail interne construit avec Symfony, Twig, Doctrine et Mercure.
status: ready
tags:
  - symfony
  - twig
  - doctrine
  - mercure
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
glowSeed: losyma
---

<div text-sm op50 tracking-widest uppercase mb-4>Projet Symfony · Webmail interne multi-utilisateurs</div>

# Losyma

<div op50 text-xl mt-4>
Modèle de données, rendu serveur et notifications temps réel.
</div>

<div mt-10 flex="~ gap-2 wrap">
  <div class="chip"><div i-logos-symfony /> Symfony 8</div>
  <div class="chip"><div i-logos-twig /> Twig</div>
  <div class="chip"><div i-logos-doctrine /> Doctrine</div>
  <div class="chip"><div i-logos-postgresql /> PostgreSQL</div>
  <div class="chip"><div i-ph-broadcast-duotone text-purple-600 /> Mercure</div>
</div>

<!--
Losyma est un client mail interne multi-utilisateurs réalisé avec Symfony 8.

L'application utilise Twig pour le rendu serveur, Doctrine avec PostgreSQL pour
la persistance et Mercure pour signaler les nouveaux messages en temps réel.

Je vais présenter les choix d'architecture, le modèle de données et les flux
techniques avant de passer à une démonstration.
-->

---
glow: top
---

# La requête HTTP reste séparée du métier

<div mt-9 flex="~ gap-3 items-center justify-center wrap" text-lg>
  <div class="chip" p3 v-click="1"><div i-ph-globe-duotone text-blue-600 /> Route</div>
  <div i-ph-arrow-right-duotone op30 v-click="2" />
  <div class="chip" p3 v-click="2"><div i-ph-steering-wheel-duotone text-lime-600 /> Contrôleur</div>
  <div i-ph-arrow-right-duotone op30 v-click="3" />
  <div class="chip" p3 v-click="3"><div i-ph-gear-six-duotone text-amber-600 /> Service</div>
  <div i-ph-arrow-right-duotone op30 v-click="4" />
  <div class="chip" p3 v-click="4"><div i-logos-doctrine /> Repository</div>
  <div i-ph-arrow-right-duotone op30 v-click="5" />
  <div class="chip" p3 v-click="5"><div i-logos-twig /> Twig</div>
</div>

<div grid="~ cols-2 gap-x-16 gap-y-7" mt-13 text-lg>
  <div flex="~ gap-3 items-start" v-click>
    <div i-ph-sign-in-duotone text-blue-600 text-2xl flex-none />
    <div>
      <div font-mono text-base>MailController</div>
      <div op50 text-base mt-1>routes, sécurité, formulaires et réponses HTTP</div>
    </div>
  </div>
  <div flex="~ gap-3 items-start" v-click>
    <div i-ph-paper-plane-tilt-duotone text-amber-600 text-2xl flex-none />
    <div>
      <div font-mono text-base>MailSender</div>
      <div op50 text-base mt-1>validation, création du message et notification</div>
    </div>
  </div>
  <div flex="~ gap-3 items-start" v-click>
    <div i-ph-tray-duotone text-lime-600 text-2xl flex-none />
    <div>
      <div font-mono text-base>MailboxView</div>
      <div op50 text-base mt-1>lecture paginée des différentes boîtes</div>
    </div>
  </div>
  <div flex="~ gap-3 items-start" v-click>
    <div i-ph-folders-duotone text-purple-600 text-2xl flex-none />
    <div>
      <div font-mono text-base>MailboxOrganizer</div>
      <div op50 text-base mt-1>archive, corbeille, restauration et favoris</div>
    </div>
  </div>
</div>

<!--
Le contrôleur est limité à la couche HTTP : il reçoit la requête, applique les
contraintes de sécurité, traite le formulaire et construit la réponse.

La logique est répartie dans des services dédiés. MailSender gère l'envoi,
MailboxView construit une page de boîte mail et MailboxOrganizer modifie le
rangement d'une copie.

Les repositories isolent les requêtes Doctrine. Twig reçoit ensuite des objets
de vue déjà préparés, au lieu de porter des règles métier.
-->

---
glow: left
---

# Le message et ses copies ont des cycles de vie distincts

<div grid="~ cols-[5fr_min-content_5fr] gap-8 items-center" mt-10>

<div>
  <div flex="~ gap-2 items-center" text-blue-600 text-xl>
    <div i-ph-envelope-simple-duotone text-2xl />
    <span font-mono>MAIL_MESSAGE</span>
  </div>
  <div mt-6 flex="~ col gap-3" text-lg>
    <div><span op50>sender</span> · expéditeur</div>
    <div><span op50>subject / body</span> · contenu partagé</div>
    <div><span op50>in_reply_to</span> · parent direct</div>
    <div><span op50>thread_root</span> · racine du fil</div>
    <div><span op50>sender_folder / starred</span> · copie émise</div>
  </div>
</div>

<div flex="~ col items-center gap-2" op50>
  <div font-mono>1</div>
  <div i-ph-arrow-right-duotone text-3xl />
  <div font-mono>N</div>
</div>

<div>
  <div flex="~ gap-2 items-center" text-purple-600 text-xl>
    <div i-ph-copy-duotone text-2xl />
    <span font-mono>MAIL_RECIPIENT</span>
  </div>
  <div mt-6 flex="~ col gap-3" text-lg>
    <div><span op50>recipient</span> · destinataire</div>
    <div><span op50>type</span> · to, cc ou bcc</div>
    <div><span op50>is_read</span> · état de lecture</div>
    <div><span op50>folder</span> · home, archive ou trash</div>
    <div><span op50>is_starred</span> · favori privé</div>
  </div>
</div>
</div>

<div op50 text-base mt-10 text-center v-click>
Archiver une copie reçue ne modifie ni le message ni les boîtes des autres utilisateurs.
</div>

<!--
Le modèle sépare le contenu commun du message et les copies reçues.

MailMessage contient l'expéditeur, le contenu et les relations nécessaires aux
fils de discussion. Il porte également l'état de la copie émise.

Chaque MailRecipient représente la copie reçue par un utilisateur, avec son type
To, Cc ou Cci, son état de lecture et son propre rangement.

Cette séparation permet d'archiver ou de marquer une copie sans modifier celles
des autres destinataires. Elle permet aussi d'appliquer la visibilité des Cci
côté PHP avant le rendu.
-->

---
layout: none
class: h-full
glow: right
---

<div h-full grid="~ rows-2">

<div px-14 pt-11 pb-7>
  <div flex="~ gap-3 items-center">
    <div i-logos-twig text-3xl />
    <h2 text-3xl m0>Twig produit la réponse HTML</h2>
  </div>
  <div mt-7 flex="~ gap-3 items-center justify-center" text-lg>
    <div class="chip" v-click><div i-ph-database-duotone text-blue-600 /> MailboxPage</div>
    <div i-ph-arrow-right-duotone op30 v-click />
    <div class="chip" v-click><div i-ph-layout-duotone text-lime-600 /> layout + fragments</div>
    <div i-ph-arrow-right-duotone op30 v-click />
    <div class="chip" v-click><div i-ph-browser-duotone text-purple-600 /> HTML</div>
  </div>
  <div op50 text-base text-center mt-6 v-click>
    Les composants Twig mutualisent les boutons, avatars, champs et badges.
  </div>
</div>

<div px-14 pt-7 pb-9 border="t gray-400/20">
  <div flex="~ gap-3 items-center">
    <div i-ph-broadcast-duotone text-purple-600 text-3xl />
    <h2 text-3xl m0>Mercure transporte uniquement l’événement</h2>
  </div>
  <div mt-7 flex="~ gap-3 items-center justify-center" text-lg>
    <div class="chip" v-click><div i-ph-paper-plane-tilt-duotone text-blue-600 /> MailNotifier</div>
    <div i-ph-arrow-right-duotone op30 v-click />
    <div class="chip" v-click><div i-ph-broadcast-duotone text-purple-600 /> topic privé</div>
    <div i-ph-arrow-right-duotone op30 v-click />
    <div class="chip" v-click><div i-ph-lightning-duotone text-amber-600 /> EventSource</div>
    <div i-ph-arrow-right-duotone op30 v-click />
    <div class="chip" v-click><div i-ph-bell-ringing-duotone text-lime-600 /> Stimulus</div>
  </div>
  <div op50 text-base text-center mt-6 v-click>
    En cas de panne du hub, l’envoi reste valide ; l’erreur est journalisée.
  </div>
</div>
</div>

<!--
Le rendu et le temps réel sont deux flux distincts.

Pour une requête classique, MailboxView produit une MailboxPage uniforme. Twig
compose le layout, les fragments et les composants pour générer la réponse HTML.

Lors d'un envoi, MailNotifier publie un événement sur le topic privé du
destinataire. Le navigateur maintient une connexion EventSource vers Mercure.
Un contrôleur Stimulus affiche le toast et met à jour la boîte ouverte.

Mercure n'est pas dans la transaction principale : si le hub est indisponible,
le message reste enregistré et l'échec de notification est journalisé.
-->

---
layout: center
glow: bottom
class: text-center
---

<div op50 text-sm tracking-widest uppercase mb-6>Passage à l’application</div>

<div text-5xl class="module-word">Démonstration</div>

<div mt-11 flex="~ gap-3 items-center justify-center wrap" text-lg>
  <div class="chip" p3 v-click="1"><div i-ph-user-circle-duotone text-blue-600 /> Alice</div>
  <div i-ph-arrow-right-duotone op30 v-click="2" />
  <div class="chip" p3 v-click="2"><div i-ph-envelope-simple-duotone text-amber-600 /> À · Cc · Cci</div>
  <div i-ph-arrow-right-duotone op30 v-click="3" />
  <div class="chip" p3 v-click="3"><div i-ph-user-circle-duotone text-lime-600 /> Bob</div>
  <div i-ph-arrow-right-duotone op30 v-click="4" />
  <div class="chip" p3 v-click="4"><div i-ph-broadcast-duotone text-purple-600 /> notification Mercure</div>
</div>

<div op50 text-lg mt-11 v-click>
Deux sessions navigateur · un envoi · aucune actualisation
</div>

<!--
Je passe maintenant à la démonstration.

Je vais ouvrir deux sessions avec Alice et Bob, envoyer un message avec plusieurs
types de destinataires, puis vérifier la réception et la notification Mercure
sans actualiser la page.

Je pourrai ensuite montrer l'archivage privé d'une copie et la visibilité des Cci.
-->
