export type Tool = 'hand' | 'slipper' | 'whip' | 'crop' | 'belt' | 'ruler' | 'swatter' | 'pan'
export type Tally = Record<Tool, number>
export type Hit = { tool: Tool; n: number; at: number; combo: number }
export type Mark = { tool: Tool; n: number }
export type Skin = 'thong' | 'plain' | 'claude' | 'openai' | 'shorts' | 'boxers' | 'jeans' | 'robot' | 'peach'
export type Lang = 'ru' | 'en'
export type Board = { pending: Tally; session: number; hit: Hit | null; marks: Mark[] }
export type Prefs = { skin: Skin; lang: Lang; isLangPinned: boolean; isMuted: boolean }

declare module 'claude-code' {
  interface PluginState {
    slapbox: { board: Board; prefs: Prefs; isPrefsLoaded: boolean; isHidden: boolean; isOpen: boolean }
  }
}
