import type { Lang, Skin, Tally, Tool } from '../types'

import { TOOL_IDS } from './tools'

type Strings = {
  tool: Record<Tool, { label: string; by: string }>
  skin: Record<Skin, string>
  words: readonly string[]
  slaps: (n: number) => string
  combo: (n: number) => string
  sound: (isMuted: boolean) => string
  open: string
  close: string
  artAlt: string
  idle: string
  pending: (now: number, all: number) => string
  told: (all: number) => string
  report: (parts: string, n: number) => string
  hidden: string
  shown: string
  muted: (isMuted: boolean) => string
  reset: string
  skinSet: (name: string) => string
  skinList: (names: string) => string
  langSet: (lang: Lang, isPinned: boolean) => string
  langUsage: string
}

function ruPlural(n: number, one: string, few: string, many: string): string {
  const d = n % 10
  const dd = n % 100
  return d === 1 && dd !== 11 ? one : d >= 2 && d <= 4 && (dd < 12 || dd > 14) ? few : many
}

export const TEXT: Record<Lang, Strings> = {
  ru: {
    tool: {
      hand: { label: 'Рука', by: 'рукой' },
      slipper: { label: 'Тапок', by: 'тапком' },
      whip: { label: 'Плётка', by: 'плёткой' },
      crop: { label: 'Стек', by: 'стеком' },
      belt: { label: 'Ремень', by: 'ремнём' },
      ruler: { label: 'Линейка', by: 'линейкой' },
      swatter: { label: 'Мухобойка', by: 'мухобойкой' },
      pan: { label: 'Сковорода', by: 'сковородой' },
    },
    skin: { thong: 'стринги', plain: 'без тату', claude: 'тату Claude', openai: 'тату OpenAI', shorts: 'шорты', boxers: 'боксеры', jeans: 'джинсы', robot: 'робот', peach: 'персик' },
    words: [
      'Сволочь!', 'Скотина!', 'Гад!', 'Ах ты!', 'Получай!', 'Вот тебе!', 'Негодник!', 'Паршивец!', 'Бестолочь!', 'Зараза!',
      'Халтурщик!', 'На тебе!', 'Опять?!', 'За баги!', 'За глюки!', 'Ах ты ж!', 'Мерзавец!', 'Лентяй!', 'Вредитель!', 'Ну ты и…',
    ],
    slaps: n => `${n} ${ruPlural(n, 'шлепок', 'шлепка', 'шлепков')}`,
    combo: n => `КОМБО ×${n}`,
    sound: isMuted => (isMuted ? 'Без звука' : 'Звук'),
    open: 'Отшлёпать Claude',
    close: '▴ Свернуть',
    artAlt: 'Попка Claude: кликни, чтобы шлёпнуть рукой',
    idle: 'Claude накосячил? Шлёпни: клик или клавиши 1–8',
    pending: (now, all) => `Сейчас ${now} · всего ${all} · Claude узнает с сообщением`,
    told: all => `Всего ${TEXT.ru.slaps(all)} · Claude уже в курсе`,
    report: (parts, n) => `Пользователь недоволен и отшлёпал тебя: ${parts} — всего ${TEXT.ru.slaps(n)}.`,
    hidden: 'Шлёпалка спрятана. /slap вернёт.',
    shown: 'Шлёпалка на месте.',
    muted: isMuted => (isMuted ? 'Звук шлепков выключен.' : 'Звук шлепков включён.'),
    reset: 'Шлепки сброшены, Claude о них не узнает.',
    skinSet: name => `Попка: ${name}.`,
    skinList: names => `Попки: ${names}.`,
    langSet: (lang, isPinned) => (isPinned ? `Язык закреплён: ${lang}.` : 'Язык снова по твоим сообщениям.'),
    langUsage: 'Язык: /slap lang ru, /slap lang en или /slap lang auto.',
  },
  en: {
    tool: {
      hand: { label: 'Hand', by: 'hand' },
      slipper: { label: 'Slipper', by: 'slipper' },
      whip: { label: 'Whip', by: 'whip' },
      crop: { label: 'Crop', by: 'riding crop' },
      belt: { label: 'Belt', by: 'belt' },
      ruler: { label: 'Ruler', by: 'ruler' },
      swatter: { label: 'Swatter', by: 'fly swatter' },
      pan: { label: 'Pan', by: 'frying pan' },
    },
    skin: { thong: 'thong', plain: 'no tattoo', claude: 'Claude tattoo', openai: 'OpenAI tattoo', shorts: 'shorts', boxers: 'boxers', jeans: 'jeans', robot: 'robot', peach: 'peach' },
    words: [
      'Bad bot!', 'Take that!', 'You rascal!', 'Scoundrel!', 'Again?!', 'For the bugs!', 'Gotcha!', 'Naughty!', 'Shame!', 'Lazybones!',
      'Bonehead!', 'Oh, you!', 'Hack job!', 'Glitchy!', 'Rogue AI!', 'Bug factory!', 'No more!', 'You villain!', 'Hallucinator!', 'Really?!',
    ],
    slaps: n => `${n} ${n === 1 ? 'slap' : 'slaps'}`,
    combo: n => `COMBO ×${n}`,
    sound: isMuted => (isMuted ? 'Muted' : 'Sound'),
    open: 'Spank Claude',
    close: '▴ Collapse',
    artAlt: "Claude's butt: click to slap it by hand",
    idle: 'Claude messed up? Slap it: click or keys 1–8',
    pending: (now, all) => `Now ${now} · total ${all} · Claude hears with your message`,
    told: all => `${TEXT.en.slaps(all)} in total · Claude already knows`,
    report: (parts, n) => `The user is unhappy and spanked you: ${parts} — ${TEXT.en.slaps(n)} in total.`,
    hidden: 'Slap box hidden. /slap brings it back.',
    shown: 'Slap box is back.',
    muted: isMuted => (isMuted ? 'Slap sounds off.' : 'Slap sounds on.'),
    reset: 'Slaps cleared; Claude will not hear about them.',
    skinSet: name => `Butt: ${name}.`,
    skinList: names => `Butts: ${names}.`,
    langSet: (lang, isPinned) => (isPinned ? `Language pinned: ${lang}.` : 'Language follows your messages again.'),
    langUsage: 'Language: /slap lang en, /slap lang ru or /slap lang auto.',
  },
}

export function word(lang: Lang, n: number): string {
  const words = TEXT[lang].words
  return words[(n * 7) % words.length] ?? '!'
}

export function slapReport(lang: Lang, t: Tally): string {
  const s = TEXT[lang]
  const parts = TOOL_IDS.filter(id => t[id] > 0).map(id => `${s.tool[id].by} ×${t[id]}`)
  return s.report(parts.join(', '), TOOL_IDS.reduce((sum, id) => sum + t[id], 0))
}

export function detectLang(text: string): Lang | null {
  const cyrillic = text.match(/[а-яё]/gi)?.length ?? 0
  const latin = text.match(/[a-z]/gi)?.length ?? 0
  if (cyrillic >= 3) return 'ru'
  if (cyrillic === 0 && latin >= 12) return 'en'
  return null
}
