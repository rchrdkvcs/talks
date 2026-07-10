---
layout: center
glow: left
---

<div flex="~ col gap-2 items-center" text-center>
  <div op50 text-sm tracking-widest uppercase>Module 1 · ~2h</div>
  <div text-5xl class="module-word" mt2>Fondations réseau</div>
  <div op50 text-xl mt3>Anatomie d'une requête web</div>
</div>

---
class: text-2xl
glow: right
---

# Le cycle de vie d'une requête

<div grid="~ cols-[max-content_min-content_auto] items-center gap-x-10 gap-y-9" py9>
  <div flex="~ gap-2 items-center" text-blue-600 v-click>
    <div i-ph-plugs-connected-duotone text-2xl />
    <span>Client & serveur</span>
  </div>
  <div i-ph-arrow-right-duotone op50 v-click />
  <div text-lg op75 v-after>protocoles, ports standards <code>80</code> / <code>443</code></div>

  <div flex="~ gap-2 items-center" text-amber-600 v-click>
    <div i-ph-map-pin-duotone text-2xl />
    <span>Routage IP</span>
  </div>
  <div i-ph-arrow-right-duotone op50 v-click />
  <div text-lg op75 v-after>IPv4 vs IPv6, du réseau local au backbone</div>

  <div flex="~ gap-2 items-center" text-lime-600 v-click>
    <div i-ph-book-open-text-duotone text-2xl />
    <span>DNS</span>
  </div>
  <div i-ph-arrow-right-duotone op50 v-click />
  <div text-lg op75 v-after>les « pages jaunes » du web — enregistrements <code>A</code>, <code>AAAA</code>, <code>CNAME</code></div>

  <div flex="~ gap-2 items-center" text-purple-600 v-click>
    <div i-ph-flask-duotone text-2xl />
    <span>Atelier</span>
  </div>
  <div i-ph-arrow-right-duotone op50 v-click />
  <div text-lg op75 v-after>un DNS local (Pi-hole, AdGuard Home) pour maîtriser la sortie de son sous-réseau</div>
</div>

---
layout: center
glow: bottom
class: text-center
---

<div text-4xl leading-relaxed>
Un port ne peut être écouté<br>que par <span text-rose-600>un seul</span> processus
</div>

<div op50 text-xl mt-6 v-click>
Il faut un intermédiaire : le <b>reverse proxy</b>.
</div>

---
glow: top
---

# Les passerelles d'entrée

<div mt-10 flex="~ gap-3 wrap" text-lg>
  <div class="chip" p3 v-click><div i-logos-nginx /> Nginx <span op50 text-sm ml-1>la référence éprouvée</span></div>
  <div class="chip" p3 v-click><div i-simple-icons-caddy text-teal-600 /> Caddy <span op50 text-sm ml-1>HTTPS automatique</span></div>
  <div class="chip" p3 v-click><div i-devicon-traefikproxy /> Traefik <span op50 text-sm ml-1>pensé pour les conteneurs</span></div>
  <div class="chip" p3 v-click><div i-ph-feather-duotone text-red-700 /> Apache <span op50 text-sm ml-1>l'historique, riche en modules</span></div>
</div>

<div mt-14 v-click>
  <div op50 text-sm tracking-widest uppercase mb-4>Le routage applicatif</div>
  <div flex="~ gap-8" text-lg>
    <div flex="~ col gap-1">
      <div text-blue-600>Par domaine</div>
      <div op50 text-base>virtual hosts</div>
    </div>
    <div flex="~ col gap-1">
      <div text-lime-600>Par chemin</div>
      <div op50 text-base font-mono>/api</div>
    </div>
    <div flex="~ col gap-1">
      <div text-amber-600>Par en-tête</div>
      <div op50 text-base font-mono>X-App-Version: v2</div>
    </div>
  </div>
</div>

---
layout: center
glow: right
---

<div flex="~ col gap-2 items-center" text-center>
  <div op50 text-sm tracking-widest uppercase>Module 2 · ~3h</div>
  <div text-5xl class="module-word" mt2>Hébergement & conteneurs</div>
  <div op50 text-xl mt3>Du métal à l'isolation applicative</div>
</div>

---
class: text-2xl
glow: left
---

# Où faire tourner l'application ?

<div grid="~ cols-[max-content_min-content_auto] items-center gap-x-10 gap-y-9" py9>
  <div flex="~ gap-2 items-center" text-blue-600 v-click>
    <div i-ph-hard-drives-duotone text-2xl />
    <span>Bare metal</span>
  </div>
  <div i-ph-arrow-right-duotone op50 v-click />
  <div text-lg op75 v-after>contrôle total, aucune interférence — mais rigidité physique</div>

  <div flex="~ gap-2 items-center" text-lime-600 v-click>
    <div i-ph-squares-four-duotone text-2xl />
    <span>VPS</span>
  </div>
  <div i-ph-arrow-right-duotone op50 v-click />
  <div text-lg op75 v-after>découpage virtuel d'une grosse machine : vCPU, RAM, disque</div>

  <div flex="~ gap-2 items-center" text-purple-600 v-click>
    <div i-ph-cloud-duotone text-2xl />
    <span>Instances cloud</span>
  </div>
  <div i-ph-arrow-right-duotone op50 v-click />
  <div text-lg op75 v-after>ressources à la demande, pilotables par API</div>
</div>

<div v-click flex="~ gap-3 items-center" text-lg mt-2>
  <div i-ph-warning-duotone text-amber-600 text-2xl flex-none />
  <div op75>Le piège des VPS : les <i>noisy neighbors</i> et l'<i>overselling</i> des providers.</div>
</div>

---
glow: bottom
---

# Docker, l'isolation des dépendances

<div op50 text-lg mt-2>Deux apps, deux versions de Node.js ou de PostgreSQL, un seul OS : conflit garanti.</div>

<div grid="~ cols-[3fr_4fr] gap-10" mt-8 items-start>

<div flex="~ col gap-6" text-lg pt-4>
  <div flex="~ gap-3 items-start" v-click="1">
    <div i-ph-file-code-duotone text-blue-600 text-2xl flex-none mt1 />
    <div>
      <div>Le Dockerfile, manifeste de l'app</div>
      <div op50 text-base mt1>image légère (Alpine, Debian Slim), couches, <code>COPY</code>, <code>RUN</code></div>
    </div>
  </div>
  <div flex="~ gap-3 items-start" v-click="5">
    <div i-ph-stack-duotone text-lime-600 text-2xl flex-none mt1 />
    <div>
      <div>Docker Compose</div>
      <div op50 text-base mt1>la stack complète — app + DB — en une commande</div>
    </div>
  </div>
</div>

<div v-click="1">

```dockerfile {*|1|2-4|5-6|*}{at:2}
FROM node:22-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
CMD ["node", "bin/server.js"]
```

<div v-click="5">

```bash
$ docker compose up
```

</div>
</div>
</div>

---
layout: center
glow: top
---

<div flex="~ col gap-2 items-center" text-center>
  <div op50 text-sm tracking-widest uppercase>Module 3 · ~3h</div>
  <div text-5xl class="module-word" mt2>Haute disponibilité</div>
  <div op50 text-xl mt3>Pourquoi Compose ne suffit pas en production</div>
</div>

---
layout: center
glow: bottom
class: text-center
---

<div text-4xl leading-relaxed>
Un seul serveur,<br>un seul <span text-rose-600>point de défaillance</span>
</div>

<div mt-10 flex="~ col gap-3 items-start" text-lg mx-auto w-max>
  <div flex="~ gap-2 items-center" v-click><div i-ph-lightning-duotone text-amber-600 /> panne matérielle</div>
  <div flex="~ gap-2 items-center" v-click><div i-ph-wrench-duotone text-blue-600 /> maintenance planifiée du provider</div>
  <div flex="~ gap-2 items-center" v-click><div i-ph-clock-countdown-duotone text-purple-600 /> downtime à chaque mise à jour de l'OS</div>
</div>

<div op50 text-lg mt-10 v-click>
Première réponse : <b>Docker Swarm</b> — réplicas, contraintes de ressources,<br>cluster multi-serveurs léger. Le « grand frère » de Compose.
</div>

---
layout: none
class: h-full
glow: right
---

<div h-full grid="~ rows-2">

<div p14>
  <h2 text-3xl mb-2 flex="~ gap-3 items-center"><div i-logos-kubernetes text-2xl /> Kubernetes <span op50 text-xl>K8s / K3s</span></h2>
  <div text-xl text-amber-600 v-click="1">le standard du marché — pas seulement pour les géants de la tech</div>
  <div mt-5 op75 text-lg v-click="2">
    <b>Control Plane</b> — le cerveau : décision, quorum, isolation géographique
  </div>
</div>

<div p14 border="t gray-400/20">
  <div op75 text-lg v-click="3">
    <b>Workers</b> — les bras : exécution des applications
  </div>
  <div v-click="4" mt-6 flex="~ gap-2 wrap" text-base>
    <div class="chip"><div i-ph-cube-duotone text-blue-600 /> Pod <span op50>· la plus petite unité</span></div>
    <div class="chip"><div i-ph-copy-duotone text-lime-600 /> Deployment <span op50>· « je veux 3 instances »</span></div>
    <div class="chip"><div i-ph-graph-duotone text-amber-600 /> Service <span op50>· DNS interne du cluster</span></div>
    <div class="chip"><div i-ph-door-open-duotone text-purple-600 /> Ingress <span op50>· pont vers l'extérieur</span></div>
  </div>
</div>
</div>

---
layout: center
glow: left
---

<div flex="~ col gap-2 items-center" text-center>
  <div op50 text-sm tracking-widest uppercase>Module 4 · ~3h</div>
  <div text-5xl class="module-word" mt2>Cloud public</div>
  <div op50 text-xl mt3>Stockage, auto-scaling et bases de données</div>
</div>

---
glow: right
---

# Un catalogue de ressources découplées

<div op50 text-lg mt-2 flex="~ gap-2 items-center">
  Infomaniak · Scaleway · <div i-logos-aws mt1 />
</div>

<div mt-8 grid="~ cols-2 gap-x-12 gap-y-8" text-xl>
  <div flex="~ gap-3 items-start" v-click>
    <div i-ph-cpu-duotone text-blue-600 text-2xl flex-none mt1 />
    <div>Compute<div op50 text-base mt1>instances à la demande</div></div>
  </div>
  <div flex="~ gap-3 items-start" v-click>
    <div i-ph-hard-drive-duotone text-lime-600 text-2xl flex-none mt1 />
    <div>Block Storage<div op50 text-base mt1>volumes SSD attachables</div></div>
  </div>
  <div flex="~ gap-3 items-start" v-click>
    <div i-ph-arrows-split-duotone text-amber-600 text-2xl flex-none mt1 />
    <div>Load Balancers<div op50 text-base mt1>répartition de charge managée</div></div>
  </div>
  <div flex="~ gap-3 items-start" v-click>
    <div i-ph-cloud-arrow-up-duotone text-purple-600 text-2xl flex-none mt1 />
    <div>Object Storage<div op50 text-base mt1>S3, R2 — fichiers et sauvegardes</div></div>
  </div>
</div>

<div v-click flex="~ gap-3 items-center" text-lg mt-10>
  <div i-logos-kubernetes text-2xl flex-none />
  <div op75>Kubernetes managé : déléguer le Control Plane pour se concentrer sur les Workers.</div>
</div>

---
layout: center
glow: bottom
class: text-center
---

<div text-4xl leading-relaxed>
Les conteneurs sont <span text-rose-600>éphémères</span>
</div>

<div op50 text-xl mt-6 v-click>
Si un pod meurt, ses données meurent avec lui.
</div>

---
class: text-2xl
glow: top
---

# Garder l'état, absorber la charge

<div grid="~ cols-[max-content_min-content_auto] items-center gap-x-10 gap-y-9" py9>
  <div flex="~ gap-2 items-center" text-blue-600 v-click>
    <div i-ph-floppy-disk-duotone text-2xl />
    <span>PVC</span>
  </div>
  <div i-ph-arrow-right-duotone op50 v-click />
  <div text-lg op75 v-after>Kubernetes demande un disque au provider et le rattache au bon worker — même si l'app se déplace</div>

  <div flex="~ gap-2 items-center" text-lime-600 v-click>
    <div i-ph-chart-line-up-duotone text-2xl />
    <span>Auto-scaling</span>
  </div>
  <div i-ph-arrow-right-duotone op50 v-click />
  <div text-lg op75 v-after>HPA + Node Autoscaler : pods et serveurs suivent la charge CPU/RAM réelle</div>

  <div flex="~ gap-2 items-center" text-purple-600 v-click>
    <div i-logos-postgresql text-2xl />
    <span>Opérateurs</span>
  </div>
  <div i-ph-arrow-right-duotone op50 v-click />
  <div text-lg op75 v-after>CloudNativePG : bascule master/replica &lt; 10 s, sauvegardes à chaud vers S3 — un DBA automatisé</div>
</div>

<div op50 text-lg v-click>L'alternative : Database-as-a-Service managée vs auto-hébergement opéré.</div>

---
layout: center
glow: right
---

<div flex="~ col gap-2 items-center" text-center>
  <div op50 text-sm tracking-widest uppercase>Module 5 · ~2h</div>
  <div text-5xl class="module-word" mt2>Automatisation & GitOps</div>
  <div op50 text-xl mt3>L'infrastructure par le code</div>
</div>

---
layout: none
class: h-full
glow: left
---

<div h-full grid="~ rows-2">

<div p14>
  <h2 text-3xl mb-2 flex="~ gap-3 items-center"><div i-logos-terraform-icon text-2xl /> Terraform / OpenTofu</h2>
  <div text-xl text-purple-600 v-click="1">provisionner les ressources physiques</div>
  <div mt-3 op75 text-lg v-click="2">instances, réseaux, load balancers — l'existence des choses</div>
</div>

<div p14 border="t gray-400/20">
  <h2 text-3xl mb-2 flex="~ gap-3 items-center"><div i-logos-ansible text-2xl /> Ansible</h2>
  <div text-xl text-rose-600 v-click="3">configurer l'intérieur de l'OS</div>
  <div mt-3 op75 text-lg v-click="4">paquets, fichiers, services — via SSH, l'état des choses</div>
</div>
</div>

---
glow: bottom
---

# Kustomize — un code, des environnements

<div op50 text-lg mt-2>Une base commune, des couches d'ajustement (<i>overlays</i>) — sans dupliquer une ligne.</div>

<div mt-10 flex="~ gap-10 items-center justify-center" text-xl>
  <div flex="~ col gap-2 items-center" v-click>
    <div class="chip" p3><div i-ph-git-fork-duotone text-blue-600 /> base/</div>
  </div>
  <div i-ph-arrows-out-duotone op30 text-2xl v-click />
  <div flex="~ col gap-4" v-after>
    <div class="chip" p3><div i-ph-test-tube-duotone text-lime-600 /> staging <span op50>· 1 réplica, petite DB</span></div>
    <div class="chip" p3><div i-ph-seal-check-duotone text-amber-600 /> production <span op50>· 3 réplicas, haute dispo</span></div>
  </div>
</div>

---
layout: center
glow: top
class: text-center
---

<div op50 text-lg mb-2>GitOps</div>

<div text-4xl>Git comme <span class="module-word" text-rose-600>source de vérité</span></div>

<div mt-12 flex="~ gap-3 items-center justify-center wrap" text-lg>
  <div class="chip" v-click="1"><div i-ph-terminal-duotone text-blue-600 /><code>git push</code></div>
  <div i-ph-arrow-right-duotone op30 v-click="2" />
  <div class="chip" v-click="2"><div i-logos-git-icon /> Dépôt Git</div>
  <div i-ph-arrow-right-duotone op30 v-click="3" />
  <div class="chip" v-click="3"><div i-logos-argo-icon /> ArgoCD / Flux</div>
  <div i-ph-arrow-right-duotone op30 v-click="4" />
  <div class="chip" v-click="4"><div i-logos-kubernetes /> Cluster</div>
</div>

<div mt-12 grid="~ cols-2 gap-12" text-left mx-auto max-w-150 v-click>
  <div>
    <div text-lime-600>Déclaratif</div>
    <div op50 text-base mt1>le cluster converge vers l'état décrit, en continu</div>
  </div>
  <div>
    <div text-amber-600>Auditable</div>
    <div op50 text-base mt1>chaque changement est un commit : revue, historique, rollback</div>
  </div>
</div>
