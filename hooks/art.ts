import type { Hit, Lang, Mark, Skin, Tool } from '../types'

import { TEXT, word } from './i18n'
import { TOOL_ART } from './tools'

export const SKIN_IDS: readonly Skin[] = ['thong', 'plain', 'claude', 'openai', 'shorts', 'boxers', 'jeans', 'robot', 'peach']

const CHEEK = { L: { x: 83, y: 56 }, R: { x: 143, y: 56 } }
const FIT = 'translate(50 -14) scale(.25)'
const PEACH_FIT = 'translate(63 1) scale(2.7)'

const SHAPE_L = 'M31.548 100.594c-70.983 99.372 0 202.62 0 202.62L57.36 441.312h180.983l13.895-209.081C226.426 68.329 31.548 100.594 31.548 100.594'
const SHAPE_R = 'M472.932 100.594c0 0-194.878-32.265-220.69 131.637l12.588 209.081h182.29l25.812-138.099C472.932 303.214 543.914 199.966 472.932 100.594'
const BAND = 'M70.335 63.167c-22.943 0-41.543 18.6-41.543 41.543c.927-1.368 1.774-2.745 2.754-4.114c0 0 194.878-32.265 220.69 131.637c25.812-163.902 220.698-131.637 220.698-131.637c1.368 1.924 2.595 3.849 3.866 5.782v-1.668c0-22.943-18.6-41.543-41.543-41.543C435.257 63.167 70.335 63.167 70.335 63.167z'
const CREASE = 'M319.946 331.091c-33.643-17.275-56.144-52.33-58.913-90.81c.167-2.67.264-5.352.264-8.046c0-4.694-3.806-8.499-8.5-8.499c-.094 0-.184.011-.277.014c-.093-.003-.184-.014-.277-.014c-4.693 0-8.499 3.805-8.5 8.499c-.001 2.695.096 5.379.264 8.05c-2.77 38.479-25.271 73.533-58.912 90.807c-4.176 2.145-5.823 7.268-3.679 11.444c1.506 2.934 4.483 4.619 7.568 4.619c1.307 0 2.633-.303 3.875-.94c27.499-14.119 48.551-38.469 59.662-67.189c11.111 28.72 32.164 53.069 59.662 67.189c1.243.638 2.569.94 3.876.94c3.085 0 6.063-1.686 7.568-4.619C325.769 338.358 324.122 333.235 319.946 331.091z'
const HEART = 'M406.091 217.973c.794-6.718 5.464-12.65 12.341-14.733c9.278-2.807 18.273 2.834 21.875 11.714c0 0 1.139 2.127 1.377 6.515c.327 5.967-1.377 11.864-4.537 16.931l-16.852 26.527l-28.337-12.853c-5.447-2.463-10.134-6.435-13.171-11.582c-2.233-3.778-2.463-6.179-2.463-6.179c-1.924-9.384 2.436-19.068 11.705-21.875C394.915 210.355 401.704 212.826 406.091 217.973'
const PEACH_BODY = 'M18 6s1.042-.896 6-.896c6.542 0 12 4.812 12 12.927 0 11.531-14.958 17.881-14.958 17.881S1 34.833 1 17.977C1 8.018 7.75 5 12 5c4.958 0 6 1 6 1z'
const PEACH_LEAF_BACK = 'M1.062 5.125s4.875-5 10-5C17.188.125 19 5.062 19 5.062s.625-4 5-4 6.938 3.125 6.938 3.125-3.562 2.125-4.625 2.562c-2.801 1.153-11.375 3.562-15.375 2.562S1.062 5.125 1.062 5.125z'
const PEACH_LEAF_FRONT = 'M1.062 5.125s4.875-5 10-5C17.188.125 19 5.062 19 5.062s-4.062 5.25-8.062 4.25-9.876-4.187-9.876-4.187z'
const PEACH_CREASE = 'M22.999 30c-.19 0-.383-.055-.554-.168-.46-.307-.584-.927-.277-1.387C22.183 28.423 24 25.538 24 19c0-6.445-4.578-10.182-4.625-10.219-.431-.345-.501-.974-.156-1.405.346-.431.975-.501 1.406-.156C20.844 7.395 26 11.604 26 19c0 7.22-2.079 10.422-2.168 10.555-.192.289-.51.445-.833.445z'

const CLAUDE_LOGO = 'M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z'
const OPENAI_LOGO = 'M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z'

const POCKET_L = 'M66 31 L95 29 L94 49 L80 55 L67 50 Z'
const POCKET_R = 'M160 31 L131 29 L132 49 L146 55 L159 50 Z'

const TABLER = {
  refresh: '<path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"/><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"/>',
  volume: '<path d="M15 8a5 5 0 0 1 0 8"/><path d="M17.7 5a9 9 0 0 1 0 14"/><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5"/>',
  'volume-off': '<path d="M15 8a5 5 0 0 1 1.912 4.934m-1.377 2.602a5 5 0 0 1 -.535 .464"/><path d="M17.7 5a9 9 0 0 1 2.362 11.086m-1.676 2.299a9 9 0 0 1 -.686 .615"/><path d="M9.069 5.054l.431 -.554a.8 .8 0 0 1 1.5 .5v2m0 4v8a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l1.294 -1.664"/><path d="M3 3l18 18"/>',
}

type Palette = { base: number[]; hot: number[]; light: number[]; edgeK: number; mark: string; blush: number }

const PALETTES: Record<Skin, Palette> = {
  thong: { base: [246, 204, 182], hot: [255, 112, 102], light: [255, 244, 236], edgeK: 0.82, mark: '#dd2a24', blush: 1 },
  plain: { base: [246, 204, 182], hot: [255, 112, 102], light: [255, 244, 236], edgeK: 0.82, mark: '#dd2a24', blush: 1 },
  claude: { base: [246, 204, 182], hot: [255, 112, 102], light: [255, 244, 236], edgeK: 0.82, mark: '#dd2a24', blush: 1 },
  openai: { base: [246, 204, 182], hot: [255, 112, 102], light: [255, 244, 236], edgeK: 0.82, mark: '#dd2a24', blush: 1 },
  shorts: { base: [255, 214, 32], hot: [255, 120, 40], light: [255, 246, 190], edgeK: 0.84, mark: '#d4231c', blush: 0.45 },
  boxers: { base: [246, 204, 182], hot: [255, 112, 102], light: [255, 244, 236], edgeK: 0.82, mark: '#dd2a24', blush: 1 },
  jeans: { base: [74, 112, 168], hot: [128, 76, 150], light: [150, 186, 230], edgeK: 0.72, mark: '#101c36', blush: 0.3 },
  robot: { base: [196, 205, 216], hot: [255, 140, 70], light: [246, 249, 252], edgeK: 0.62, mark: '#2b3138', blush: 0.4 },
  peach: { base: [255, 150, 116], hot: [236, 64, 64], light: [255, 214, 190], edgeK: 0.8, mark: '#b8202a', blush: 0.5 },
}

const PIXELS = [
  '..BBBBBBBBBBBBBB..',
  '.BBBBBBBBBBBBBBBB.',
  '.SSSSSSSDSSSSSSSS.',
  'SSSSSSSSDDSSSSSSSS',
  'SSSSSSSSDDSSSSSSSS',
  'SSSSSSSSDDSSSSSSSS',
  '.SSSSSS.DD.SSSSSS.',
  '..SSSS......SSSS..',
]

function mixColor(a: number[], b: number[], t: number, k = 1): string {
  const c = Math.max(0, Math.min(1, t))
  return '#' + a.map((v, i) => Math.round(Math.min(255, (v + ((b[i] ?? v) - v) * c) * k)).toString(16).padStart(2, '0')).join('')
}

function side(n: number): 'L' | 'R' {
  return n % 2 ? 'R' : 'L'
}

function spot(n: number): { x: number; y: number; rot: number } {
  const c = CHEEK[side(n)]
  return { x: c.x + ((n * 37) % 15) - 7 + (side(n) === 'L' ? -2 : 2), y: c.y + 6 + ((n * 53) % 11) - 2, rot: ((n * 71) % 70) - 35 }
}

function escapeText(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;')
}

function markAt(m: Mark, color: string, isFresh: boolean): string {
  const p = spot(m.n)
  const art = TOOL_ART[m.tool]
  const paint = art.isStrokeMark ? `fill="none" stroke="${color}"` : `fill="${color}"`
  return `<g class="${isFresh ? 'fresh' : 'old'}" transform="translate(${p.x} ${p.y}) rotate(${p.rot}) scale(.9)" ${paint}>${art.mark}</g>`
}

function burst(text: string, combo: string | null): string {
  const rx = Math.max(15, text.length * 3.8 + 9)
  const ry = 21
  const pts: string[] = []
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2
    const r = i % 2 ? 0.72 : 1.08
    pts.push(`${(Math.cos(a) * rx * r).toFixed(1)},${(Math.sin(a) * ry * r).toFixed(1)}`)
  }
  const badge = combo
    ? `<text x="0" y="34" text-anchor="middle" font-family="Impact,'Arial Black',sans-serif" font-size="11" fill="#fff" stroke="#e8231d" stroke-width="3" paint-order="stroke">${escapeText(combo)}</text>`
    : ''
  return `<polygon points="${pts.join(' ')}" fill="#ffd23f" stroke="#ff8a1f" stroke-width="1.5"/>` +
    `<text x="0" y="4.5" text-anchor="middle" font-family="Impact,'Arial Black',sans-serif" font-size="13" fill="#e8231d" stroke="#fff" stroke-width="2.6" paint-order="stroke">${escapeText(text)}</text>` +
    badge
}

function rivets(): string {
  const spots: [number, number][] = [[66, 16], [84, 13], [102, 15], [124, 15], [142, 13], [160, 16], [62, 72], [72, 84], [154, 72], [150, 84]]
  return spots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#7f8a96"/><circle cx="${x - 0.5}" cy="${y - 0.5}" r=".6" fill="#fff" opacity=".7"/>`).join('')
}

function tattoo(d: string, ink: string): string {
  return `<g transform="translate(151 45) rotate(-12) scale(.68) translate(-12 -12)" opacity=".88"><path d="${d}" fill="${ink}" fill-rule="evenodd"/></g>`
}

function pocket(d: string): string {
  return `<path d="${d}" fill="#000" opacity=".1"/><path d="${d}" fill="none" stroke="#e0a84a" stroke-width=".9" stroke-dasharray="2 1.4"/>`
}

function buttBody(skin: Skin, edge: string, left: string, right: string): string {
  const cheek = (shape: string, grad: string, clip: string, marks: string, gx: number, extra: string) =>
    `<g><path transform="${FIT}" d="${shape}" fill="url(#${grad})"/>${extra}<g clip-path="url(#${clip})">${marks}</g>` +
    `<ellipse cx="${gx}" cy="44" rx="8" ry="5" fill="#fff" opacity="${skin === 'robot' ? '.55' : '.32'}" filter="url(#glow)"/></g>`
  const boxers = (clip: string) => `<path clip-path="url(#${clip})" d="M40 0 H190 V50 Q150 63 113 54 Q76 63 36 50 Z" fill="url(#dots)"/>`
  const heart = skin === 'thong' || skin === 'shorts' ? `<path transform="${FIT}" d="${HEART}" fill="${skin === 'shorts' ? '#db4d6c' : '#f30043'}" opacity=".92"/>` : ''
  const band = skin === 'thong' || skin === 'plain' || skin === 'claude' || skin === 'openai' ? 'url(#pants)' : skin === 'shorts' ? '#f6b800' : skin === 'boxers' ? '#24479a' : skin === 'jeans' ? '#34548c' : '#3a434e'
  const extraL = skin === 'boxers' ? boxers('cl') : skin === 'jeans' ? pocket(POCKET_L) : ''
  const ink = skin === 'claude' ? tattoo(CLAUDE_LOGO, '#c4552f') : skin === 'openai' ? tattoo(OPENAI_LOGO, '#1b1b1b') : ''
  const extraR = (skin === 'boxers' ? boxers('cr') : skin === 'jeans' ? pocket(POCKET_R) : '') + heart + ink
  const top = skin === 'robot'
    ? rivets() + '<circle cx="113" cy="10" r="4.5" fill="#5cf08a" opacity=".3"/><circle cx="113" cy="10" r="2.4" fill="#5cf08a"/>'
    : skin === 'jeans'
      ? '<path d="M62 24 Q113 33 164 24" fill="none" stroke="#e0a84a" stroke-width=".9" stroke-dasharray="2 1.4"/><rect x="134" y="6" width="15" height="8" rx="1.5" fill="#a86d34"/>'
      : ''
  return cheek(SHAPE_L, 'sl', 'cl', left, 66, extraL) +
    cheek(SHAPE_R, 'sr', 'cr', right, 160, extraR) +
    `<path transform="${FIT}" d="${CREASE}" fill="${skin === 'robot' ? '#4a525c' : skin === 'jeans' ? '#e0a84a' : edge}" opacity=".9"/>` +
    `<path transform="${FIT}" d="${BAND}" fill="${band}"/>` +
    top
}

function peachBody(edge: string, left: string, right: string): string {
  return `<g transform="${PEACH_FIT}"><path d="${PEACH_LEAF_BACK}" fill="#5c913b"/><path d="${PEACH_BODY}" fill="url(#sl)"/></g>` +
    `<g clip-path="url(#pb)">${left}${right}</g>` +
    `<ellipse cx="88" cy="40" rx="9" ry="6" fill="#fff" opacity=".3" filter="url(#glow)"/>` +
    `<g transform="${PEACH_FIT}"><path d="${PEACH_LEAF_FRONT}" fill="#77b255"/><path d="${PEACH_CREASE}" fill="${edge}"/></g>`
}

type Colors = { mark: string; base: string; edge: string; light: string }

function colors(skin: Skin, redness: number): Colors {
  const p = PALETTES[skin]
  const heat = redness * p.blush
  return {
    mark: p.mark,
    base: mixColor(p.base, p.hot, heat),
    edge: mixColor(p.base, p.hot, Math.min(1, heat + 0.15), p.edgeK),
    light: mixColor(p.light, [255, 200, 190], heat),
  }
}

function defs(c: Colors): string {
  const { base, edge, light } = c
  return `<defs>
<radialGradient id="sl" cx="42%" cy="46%" r="62%"><stop offset="0" stop-color="${light}"/><stop offset=".5" stop-color="${base}"/><stop offset="1" stop-color="${edge}"/></radialGradient>
<radialGradient id="sr" cx="58%" cy="46%" r="62%"><stop offset="0" stop-color="${light}"/><stop offset=".5" stop-color="${base}"/><stop offset="1" stop-color="${edge}"/></radialGradient>
<linearGradient id="pants" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff2a5f"/><stop offset="1" stop-color="#c8003a"/></linearGradient>
<pattern id="dots" width="9" height="9" patternUnits="userSpaceOnUse"><rect width="9" height="9" fill="#3b6fd4"/><circle cx="2.5" cy="2.5" r="1.7" fill="#fff"/><circle cx="7" cy="7" r="1.7" fill="#fff"/></pattern>
<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6"/></filter>
<clipPath id="cl"><path transform="${FIT}" d="${SHAPE_L}"/></clipPath>
<clipPath id="cr"><path transform="${FIT}" d="${SHAPE_R}"/></clipPath>
<clipPath id="pb"><path transform="${PEACH_FIT}" d="${PEACH_BODY}"/></clipPath>
</defs>`
}

function body(skin: Skin, edge: string, left: string, right: string): string {
  return skin === 'peach' ? peachBody(edge, left, right) : buttBody(skin, edge, left, right)
}

export function miniButt(skin: Skin, redness: number, size: number): string {
  const c = colors(skin, redness)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="50 -2 126 102">${defs(c)}${body(skin, c.edge, '', '')}</svg>`
}

export function scene(skin: Skin, redness: number, marks: Mark[], active: Hit | null, lang: Lang): string {
  const c = colors(skin, redness)
  const { edge } = c
  const hitSide = active ? side(active.n) : null
  const draw = (s: 'L' | 'R') => marks.filter(m => side(m.n) === s).map(m => markAt(m, c.mark, active !== null && m.n === active.n)).join('')
  const at = active ? spot(active.n) : null
  const strike = active ? TOOL_ART[active.tool].strike : [0, 0]
  const combo = active && active.combo >= 3 ? TEXT[lang].combo(active.combo) : null
  const sprite = active && at
    ? `<g transform="translate(${at.x + (strike[0] ?? 0)} ${at.y + (strike[1] ?? 0)})"><g class="land">${TOOL_ART[active.tool].sprite}</g></g>` +
      `<g class="pop" transform="translate(212 30)">${burst(word(lang, active.n), combo)}</g>`
    : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="100" viewBox="0 0 260 100"><!-- ${skin} ${active?.n ?? 0} -->
${defs(c)}
<style>
.butt{transform-origin:113px 96px;animation:${active ? `jiggle${hitSide} .95s linear .21s 1 both, breathe 2.8s ease-in-out 1.16s infinite` : 'breathe 2.8s ease-in-out infinite'}}
@keyframes breathe{0%,100%{transform:scale(1,1)}50%{transform:scale(1.012,.99)}}
@keyframes jiggleL{0%{transform:none}7%{transform:scale(1.07,.93) skewX(2.5deg)}20%{transform:scale(.965,1.04) skewX(-1.8deg)}34%{transform:scale(1.03,.975) skewX(1.1deg)}50%{transform:scale(.988,1.012) skewX(-.6deg)}67%{transform:scale(1.005,.996) skewX(.25deg)}84%{transform:scale(.999,1.001)}100%{transform:none}}
@keyframes jiggleR{0%{transform:none}7%{transform:scale(1.07,.93) skewX(-2.5deg)}20%{transform:scale(.965,1.04) skewX(1.8deg)}34%{transform:scale(1.03,.975) skewX(-1.1deg)}50%{transform:scale(.988,1.012) skewX(.6deg)}67%{transform:scale(1.005,.996) skewX(-.25deg)}84%{transform:scale(.999,1.001)}100%{transform:none}}
.old{opacity:.5}.fresh{opacity:0;animation:fresh .6s ease-out .2s forwards}@keyframes fresh{0%{opacity:0}25%{opacity:.95}100%{opacity:.62}}
.land{transform-box:fill-box;transform-origin:center;animation:land .5s linear forwards}
@keyframes land{0%{transform:translate(30px,-38px) rotate(38deg);opacity:1;animation-timing-function:cubic-bezier(.6,0,.9,.4)}42%{transform:translate(0,0) rotate(-6deg) scale(1.06,.92);opacity:1;animation-timing-function:ease-out}58%{transform:translate(2px,-3px) rotate(0deg) scale(1,1);opacity:1}100%{transform:translate(18px,-26px) rotate(22deg);opacity:0}}
.pop{animation:pop 1.1s ease-out .18s both}@keyframes pop{0%{transform:translate(212px,30px) scale(.2);opacity:0}18%{transform:translate(212px,30px) scale(1.18);opacity:1}30%{transform:translate(212px,30px) scale(1);opacity:1}75%{transform:translate(212px,30px) scale(1);opacity:1}100%{transform:translate(212px,26px) scale(.9);opacity:0}}
</style>
<g class="butt">
${body(skin, edge, draw('L'), draw('R'))}
</g>
${sprite}
</svg>`
}

export function toolIcon(tool: Tool, size: number): string {
  const i = TOOL_ART[tool].icon
  const rules = [i.thick > 1 ? `path[stroke]{stroke-width:${(2.6 * i.thick).toFixed(1)}px}` : '', i.lift > 1 ? `g{filter:brightness(${i.lift})}` : ''].join('')
  const style = rules ? `<style>${rules}</style>` : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${i.box}">${style}<g transform="rotate(${i.turn})">${TOOL_ART[tool].sprite}</g></svg>`
}

export function uiIcon(name: keyof typeof TABLER, size: number, color: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${TABLER[name]}</svg>`
}

export function pixelRows(skin: Skin, redness: number): { ch: string; fg?: string; bg?: string }[][] {
  const p = PALETTES[skin]
  const heat = redness * p.blush
  const color = (c: string): string | undefined =>
    c === 'B' ? '#d97757' : c === 'S' ? mixColor(p.base, p.hot, heat) : c === 'D' ? mixColor(p.base, p.hot, Math.min(1, heat + 0.3), p.edgeK) : undefined
  const rows: { ch: string; fg?: string; bg?: string }[][] = []
  for (let y = 0; y < PIXELS.length; y += 2) {
    const top = PIXELS[y] ?? ''
    const bottom = PIXELS[y + 1] ?? ''
    const row: { ch: string; fg?: string; bg?: string }[] = []
    for (let x = 0; x < top.length; x++) {
      const t = color(top[x] ?? '.')
      const b = color(bottom[x] ?? '.')
      row.push(t && b ? { ch: '▀', fg: t, bg: b } : t ? { ch: '▀', fg: t } : b ? { ch: '▄', fg: b } : { ch: ' ' })
    }
    rows.push(row)
  }
  return rows
}
