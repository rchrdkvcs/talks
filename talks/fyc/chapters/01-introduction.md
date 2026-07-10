---
layout: center
glow: bottom
class: text-center
---

<div text-4xl leading-relaxed>
Une application web<br>ne vit pas seule dans un <span text-orange-600 font-mono text-3xl>git repo</span>
</div>

<div op50 text-xl mt-6 v-click>
Elle dépend de couches qu'il faut comprendre<br>pour déployer, diagnostiquer et faire évoluer un service.
</div>

---
class: text-2xl
glow: right
---

# Ce que l'on va construire

<div grid="~ cols-[max-content_min-content_auto] items-center gap-x-10 gap-y-10" py10>
  <div flex="~ gap-2 items-center" text-blue-600 v-click>
    <div i-ph-magnifying-glass-duotone text-2xl />
    <span>Comprendre</span>
  </div>
  <div i-ph-arrow-right-duotone op50 v-click />
  <div text-lg op75 v-after>DNS, réseau, HTTP, reverse proxy, TLS</div>

  <div flex="~ gap-2 items-center" text-lime-600 v-click>
    <div i-ph-rocket-launch-duotone text-2xl />
    <span>Déployer</span>
  </div>
  <div i-ph-arrow-right-duotone op50 v-click />
  <div text-lg op75 v-after>VPS, conteneurs, orchestrateurs, cloud managé</div>

  <div flex="~ gap-2 items-center" text-purple-600 v-click>
    <div i-ph-arrows-clockwise-duotone text-2xl />
    <span>Automatiser</span>
  </div>
  <div i-ph-arrow-right-duotone op50 v-click />
  <div text-lg op75 v-after>Infrastructure as Code et GitOps</div>
</div>
