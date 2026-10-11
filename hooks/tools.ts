import type { Tool } from '../types'

export type ToolArt = {
  emoji: string
  sprite: string
  strike: [number, number]
  mark: string
  isStrokeMark: boolean
  icon: { box: string; turn: number; thick: number; lift: number }
}

export const TOOL_IDS: readonly Tool[] = ['hand', 'slipper', 'whip', 'crop', 'belt', 'ruler', 'swatter', 'pan']

const SWATTER_MARK = [0, 1, 2, 3]
  .flatMap(i => [0, 1, 2, 3].map(j => `<rect x="${(-8.2 + i * 4.4).toFixed(1)}" y="${(-8.2 + j * 4.4).toFixed(1)}" width="3.2" height="3.2" rx=".6"/>`))
  .join('')

export const TOOL_ART: Record<Tool, ToolArt> = {
  hand: {
    emoji: '✋',
    sprite: '<g stroke="#8f5b45" stroke-width="1.3" fill="#ffe2d0"><rect x="-9" y="-6" width="18" height="20" rx="7"/><rect x="-9" y="-22" width="4.4" height="18" rx="2.2"/><rect x="-4" y="-25" width="4.4" height="21" rx="2.2"/><rect x="1" y="-24" width="4.4" height="20" rx="2.2"/><rect x="6" y="-19" width="4" height="15" rx="2"/><rect x="-15" y="0" width="9" height="4.6" rx="2.3" transform="rotate(-25 -10 2)"/><rect x="-7" y="13" width="14" height="10" rx="2" fill="#d97757"/></g>',
    strike: [0, -4],
    mark: '<ellipse cx="0" cy="3" rx="6.5" ry="7"/><rect x="-6.5" y="-11" width="3" height="10" rx="1.5"/><rect x="-2.8" y="-13" width="3" height="11" rx="1.5"/><rect x="0.9" y="-12" width="3" height="10.5" rx="1.5"/><rect x="4.4" y="-9" width="2.8" height="8.5" rx="1.4"/><ellipse cx="-8.5" cy="4" rx="2" ry="4.5" transform="rotate(-35 -8.5 4)"/>',
    isStrokeMark: false,
    icon: { box: '-17 -27 34 52', turn: 0, thick: 1, lift: 1 },
  },
  slipper: {
    emoji: '🩴',
    sprite: '<g><path d="M0 -26 C11 -26 13 -10 10 6 C8 18 4 24 0 24 C-4 24 -8 18 -10 6 C-13 -10 -11 -26 0 -26 Z" fill="#3fa7e0" stroke="#1d6a98" stroke-width="1.4"/><path d="M-9 -2 L0 -16 L9 -2" fill="none" stroke="#ffcc33" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>',
    strike: [0, 0],
    mark: '<path d="M0 -13 C7 -13 8 -4 6 4 C5 11 2 14 0 14 C-2 14 -5 11 -6 4 C-8 -4 -7 -13 0 -13 Z"/><path d="M-4 -6 H4 M-4.5 0 H4.5 M-4 6 H4" stroke="#000" stroke-width="1" opacity=".25"/>',
    isStrokeMark: false,
    icon: { box: '-17 -30 34 58', turn: 0, thick: 1, lift: 1 },
  },
  whip: {
    emoji: '➰',
    sprite: '<g><rect x="-3" y="4" width="6" height="22" rx="2.5" fill="#6b3e22" stroke="#3d2212" stroke-width="1"/><path d="M0 4 C-2 -10 10 -18 4 -30 C0 -38 -10 -36 -14 -44" fill="none" stroke="#8a5530" stroke-width="2.4" stroke-linecap="round"/></g>',
    strike: [12, 34],
    mark: '<path d="M-15 -5 Q0 -12 15 -3" fill="none" stroke-width="2.4" stroke-linecap="round"/><path d="M-14 4 Q1 -3 14 6" fill="none" stroke-width="2" stroke-linecap="round"/>',
    isStrokeMark: true,
    icon: { box: '-31 -33 62 62', turn: 45, thick: 2.4, lift: 1.7 },
  },
  crop: {
    emoji: '🏇',
    sprite: '<g><path d="M0 26 L0 -26" stroke="#4a2e1c" stroke-width="3" stroke-linecap="round"/><rect x="-2" y="20" width="4" height="9" rx="1.5" fill="#222"/><rect x="-6" y="-34" width="12" height="9" rx="1.5" fill="#1d1d1d" stroke="#000" stroke-width=".8"/></g>',
    strike: [0, 30],
    mark: '<rect x="-6" y="-4.5" width="12" height="9" rx="1.8"/><path d="M-6 0 H6" stroke="#000" stroke-width=".8" opacity=".25"/>',
    isStrokeMark: false,
    icon: { box: '-27 -27 54 54', turn: 45, thick: 2.2, lift: 2.2 },
  },
  belt: {
    emoji: '🪢',
    sprite: '<g><path d="M-5 27 V-17 Q-5 -31 0 -31 Q5 -31 5 -17 V27" fill="none" stroke="#4a2c16" stroke-width="6.4" stroke-linejoin="round"/><path d="M-5 27 V-17 Q-5 -31 0 -31 Q5 -31 5 -17 V27" fill="none" stroke="#8a5a32" stroke-width="4"/><path d="M-5 25 V-16 M5 25 V-16" stroke="#c99a62" stroke-width=".7" stroke-dasharray="2 1.6"/><rect x="-10" y="17" width="20" height="12" rx="2.6" fill="none" stroke="#e2b44a" stroke-width="2.6"/><path d="M0 17 V29" stroke="#e2b44a" stroke-width="2"/></g>',
    strike: [0, 28],
    mark: '<rect x="-15" y="-4" width="30" height="8" rx="4"/><rect x="-14" y="5.5" width="28" height="2.6" rx="1.3" opacity=".55"/>',
    isStrokeMark: false,
    icon: { box: '-25 -25 50 50', turn: 45, thick: 1, lift: 1.25 },
  },
  ruler: {
    emoji: '📏',
    sprite: '<g><rect x="-5" y="-34" width="10" height="64" rx="1.4" fill="#f2c96b" stroke="#a87b2a" stroke-width="1.1"/><path d="M-5 -28h3M-5 -22h5M-5 -16h3M-5 -10h5M-5 -4h3M-5 2h5M-5 8h3M-5 14h5M-5 20h3M-5 26h5" stroke="#7a5418" stroke-width=".9"/></g>',
    strike: [0, 30],
    mark: '<rect x="-15" y="-2.8" width="30" height="5.6" rx="1"/>',
    isStrokeMark: false,
    icon: { box: '-25 -25 50 50', turn: 45, thick: 1, lift: 1 },
  },
  swatter: {
    emoji: '🪰',
    sprite: '<g><path d="M0 30 V-4" stroke="#2f8f4e" stroke-width="3.2" stroke-linecap="round"/><rect x="-12" y="-30" width="24" height="26" rx="4" fill="#3cc46a" stroke="#1f7a3e" stroke-width="1.4"/><path d="M-6 -30 v26 M0 -30 v26 M6 -30 v26 M-12 -23.5 h24 M-12 -17 h24 M-12 -10.5 h24" stroke="#1f7a3e" stroke-width=".9" opacity=".7"/></g>',
    strike: [0, 17],
    mark: SWATTER_MARK,
    isStrokeMark: false,
    icon: { box: '-25 -25 50 50', turn: 45, thick: 1, lift: 1.1 },
  },
  pan: {
    emoji: '🍳',
    sprite: '<g><rect x="-2.8" y="1" width="5.6" height="29" rx="2.6" fill="#3a2a20"/><circle cx="0" cy="-14" r="16" fill="#2b2f36" stroke="#14171b" stroke-width="1.6"/><circle cx="0" cy="-14" r="11.5" fill="#3d434c"/><ellipse cx="-4.5" cy="-19.5" rx="5" ry="3" fill="#fff" opacity=".2"/></g>',
    strike: [0, 14],
    mark: '<circle r="11" opacity=".8"/><circle r="6.5" opacity=".35"/>',
    isStrokeMark: false,
    icon: { box: '-24 -24 48 48', turn: 45, thick: 1, lift: 1.8 },
  },
}
