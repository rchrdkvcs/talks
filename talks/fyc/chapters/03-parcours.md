---
layout: center
glow: bottom
class: text-center
---

<div op50 text-lg mb-2>Le fil rouge</div>

<div text-4xl>Une application, <span class="module-word" text-rose-600>quatre</span> déploiements</div>

<div mt-10 flex="~ gap-3 items-center justify-center">
  <div class="chip" text-xl p3><div i-logos-adonisjs-icon /> API AdonisJS</div>
  <div op30 text-xl>+</div>
  <div class="chip" text-xl p3><div i-logos-postgresql /> PostgreSQL</div>
</div>

<div op50 mt-10 v-click>
Pas de théorie hors sol : chaque notion est reliée à un déploiement observable.<br>
Les limites de chaque étape motivent la suivante.
</div>

---
glow: right
---

# La trajectoire

<div flex="~ col gap-9" mt-12 text-xl>
  <div flex="~ gap-4 items-start" v-click>
    <div i-ph-number-circle-one-duotone text-blue-600 text-3xl flex-none />
    <div>
      <div>Comprendre la requête web</div>
      <div op50 text-base mt1>navigateur, DNS, ports, HTTP, reverse proxy</div>
    </div>
  </div>
  <div flex="~ gap-4 items-start" v-click>
    <div i-ph-number-circle-two-duotone text-lime-600 text-3xl flex-none />
    <div>
      <div>Héberger et isoler</div>
      <div op50 text-base mt1>bare metal, VPS, Dockerfile, Docker Compose</div>
    </div>
  </div>
  <div flex="~ gap-4 items-start" v-click>
    <div i-ph-number-circle-three-duotone text-purple-600 text-3xl flex-none />
    <div>
      <div>Orchestrer et automatiser</div>
      <div op50 text-base mt1>Kubernetes, cloud managé, Infrastructure as Code, GitOps</div>
    </div>
  </div>
</div>
