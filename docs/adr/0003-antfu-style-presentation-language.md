# Antfu-style presentation language on a light theme

Les Talks suivent le style de présentation des decks Slidev d'Anthony Fu (référence : `antfu/talks`, édition 2025-10-25), transposé sur l'identité claire du dépôt plutôt que sur son thème sombre. Une première itération à base de cartes bordées « corporate » (essayée sur le talk `fyc`) a été rejetée : visuellement bruyante, elle diluait le propos de chaque slide.

Le langage retenu :

- **Une idée par slide** — beaucoup de slides courtes plutôt que peu de slides denses ; `layout: center` pour les déclarations, avec un seul mot accentué (`text-rose-600`).
- **Hiérarchie par opacité, pas par boîtes** — texte principal plein, secondaire en `op50`/`op75` ; pas de cartes bordées ni d'ombres.
- **Révélations progressives** — `v-click` / `v-after` sur chaque liste ou flux.
- **Grilles icône → flèche → description** — `grid="~ cols-[max-content_min-content_auto]"`, icônes Phosphor duotone colorées (une couleur d'accent par ligne : blue/lime/amber/purple-600).
- **Chips translucides** (`.chip`) — outils et étapes de flux, avec logos `i-logos-*`.
- **Séparateurs de section typographiques** — kicker en capitales espacées `op50` + grand titre serif (`.module-word`).
- **Slides en deux bandes** — `layout: none` + hairline `border="t gray-400/20"` pour les oppositions (ex. Control Plane / Workers).
- **UnoCSS en mode attributify** — la syntaxe des sources d'antfu (`flex="~ gap-2"`, `op50`).
- **Polices** — `fonts: { sans: DM Sans, serif: Bodoni Moda }` dans le frontmatter Slidev de chaque talk.

Les pièces réutilisables vivent dans `shared/style.css` (`.chip`, `.module-word`, typographie des titres) ; les gabarits du Talk Manager (`scripts/talk-manager/templates.ts`) génèrent les nouveaux talks à partir de ces patterns, et `example-talk` les démontre. Le talk `fyc` est la première application complète.
