import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
export const talksDir = resolve(root, 'talks')
export const catalogDir = resolve(root, 'docs', 'catalog')
export const distDir = resolve(root, 'dist')

export function talkDir(slug: string) {
  return resolve(talksDir, slug)
}

export function talkSlidesPath(slug: string) {
  return resolve(talkDir(slug), 'slides.md')
}

export function talkPublicBase(slug: string) {
  return `/${slug}/`
}

export function talkBuildOutput(slug: string) {
  return resolve(distDir, slug)
}

export function talkPdfPath(slug: string) {
  return resolve(distDir, 'artifacts', `${slug}.pdf`)
}

export function talkPackagePdfOutput(slug: string) {
  return `../../dist/artifacts/${slug}.pdf`
}

export function talkPdfHref(slug: string) {
  return `/artifacts/${slug}.pdf`
}

export function talkSourceHref(slug: string) {
  return `talks/${slug}/slides.md`
}
