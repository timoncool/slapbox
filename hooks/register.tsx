import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, RenderChildren } from 'claude-code'

import type { Board, Lang, Prefs, Skin, Tally, Tool } from '../types'

import { SKIN_IDS, miniButt, pixelRows, scene, toolIcon, uiIcon } from './art'
import { TEXT, detectLang, slapReport } from './i18n'
import { TOOL_ART, TOOL_IDS } from './tools'

const MAX_MARKS = 10
const HIT_MS = 1500
const COMBO_MS = 900
const ART = { desktop: { columns: 45, rows: 12, width: 360, height: 138 }, terminal: { columns: 18, rows: 4 } }
const TILE = { columns: 16, rows: 3, gap: 1, iconPx: 20, minPerRow: 2, maxPerRow: 4 }
const CHIP_ICON_PX = 18
const SMALL_ICON_PX = 14
const SKIN_HOTKEY = '9'
const SOUND_HOTKEY = '0'
const ACTIONS: readonly string[] = [...TOOL_IDS, 'skin', 'sound', 'open', 'close']

const EMPTY = Object.fromEntries(TOOL_IDS.map(id => [id, 0])) as Tally

const board = atom({ plugin: 'slapbox', key: 'board' } as const, { pending: EMPTY, session: 0, hit: null, marks: [] } as Board)
const prefs = atom({ plugin: 'slapbox', key: 'prefs' } as const, { skin: 'thong', lang: 'en', isLangPinned: false, isMuted: false } as Prefs)
const isPrefsLoaded = atom({ plugin: 'slapbox', key: 'isPrefsLoaded' } as const, false)
const isHidden = atom({ plugin: 'slapbox', key: 'isHidden' } as const, false)
const isOpen = atom({ plugin: 'slapbox', key: 'isOpen' } as const, false)

let isWindows = false
let forcedLang: Lang | null = null
const lastSeq = new Map<string, unknown>()

function tally(t: Partial<Tally> | undefined): Tally {
  return Object.fromEntries(TOOL_IDS.map(id => [id, t?.[id] ?? 0])) as Tally
}

function total(t: Tally): number {
  return TOOL_IDS.reduce((sum, id) => sum + t[id], 0)
}

function nextSkin(skin: Skin): Skin {
  return SKIN_IDS[(SKIN_IDS.indexOf(skin) + 1) % SKIN_IDS.length] ?? 'thong'
}

function langOf(p: Prefs): Lang {
  return forcedLang ?? p.lang
}

async function loadPrefs($: EngineInterface): Promise<void> {
  const saved = (await $.store.get('prefs').catch(() => undefined)) as Partial<Prefs> | undefined
  const env = (await $.env.get('LANG').catch(() => undefined)) ?? ''
  await update($, prefs, () => ({
    skin: SKIN_IDS.find(id => id === saved?.skin) ?? 'thong',
    lang: saved?.lang === 'ru' || saved?.lang === 'en' ? saved.lang : /^ru/i.test(env) ? 'ru' : 'en',
    isLangPinned: saved?.isLangPinned === true,
    isMuted: saved?.isMuted === true,
  }))
  await update($, isPrefsLoaded, () => true)
}

async function savePrefs($: EngineInterface, change: (p: Prefs) => Prefs): Promise<Prefs> {
  const next = await update($, prefs, change)
  await $.store.set('prefs', next).catch(err => $.ui.log(`slapbox: prefs not saved: ${String(err)}`, { to: 'debug' }))
  return next
}

async function slap($: EngineInterface, tool: Tool): Promise<void> {
  const at = await $.clock.now()
  await update($, board, b => {
    const n = b.session + 1
    const combo = b.hit && at - b.hit.at < COMBO_MS ? (b.hit.combo ?? 1) + 1 : 1
    const pending = tally(b.pending)
    return { pending: { ...pending, [tool]: pending[tool] + 1 }, session: n, hit: { tool, n, at, combo }, marks: [...b.marks, { tool, n }].slice(-MAX_MARKS) }
  })
  if (isWindows && !(await read($, prefs)).isMuted) {
    const wav = `${$.plugin.root}/hooks/sounds/${tool}.wav`
    void $.process.run(['powershell', '-NoProfile', '-Command', `(New-Object System.Media.SoundPlayer '${wav}').PlaySync()`], { timeoutMs: 10_000 }).catch(() => {})
  }
}

async function act($: EngineInterface, action: string): Promise<void> {
  const tool = TOOL_IDS.find(id => id === action)
  if (tool) await slap($, tool)
  else if (action === 'skin') await savePrefs($, p => ({ ...p, skin: nextSkin(p.skin) }))
  else if (action === 'sound') await savePrefs($, p => ({ ...p, isMuted: !p.isMuted }))
  else if (action === 'open' || action === 'close') await update($, isOpen, () => action === 'open')
}

function pressing($: EngineInterface, action: string): () => void {
  return () => void act($, action).catch(err => $.ui.log(`slapbox: ${action} failed: ${String(err)}`, { to: 'debug' }))
}

export const register: Register = (on, options) => {
  forcedLang = options.language === 'ru' || options.language === 'en' ? options.language : null

  on('session.start', async ($, e, next) => {
    const r = await next(e)
    isWindows = (await $.env.get('OS').catch(() => undefined)) === 'Windows_NT'
    await loadPrefs($)
    await $.command
      .register({ name: 'slap', description: 'Slap box: /slap hides or shows it; /slap mute, /slap reset, /slap skin [name], /slap lang [en|ru|auto]', argumentHint: '[mute|reset|skin|lang]', immediate: true })
      .catch(err => $.ui.log(`slapbox: /slap not registered: ${String(err)}`, { to: 'debug' }))
    return r
  })

  on('turn.start', async ($, e, next) => {
    if (!(await read($, isPrefsLoaded))) await loadPrefs($)
    return next(e)
  })

  on('prompt.submit', async ($, e, next) => {
    if (!(await read($, isPrefsLoaded))) await loadPrefs($)
    let p = await read($, prefs)
    const detected = forcedLang || p.isLangPinned ? null : detectLang(e.text ?? '')
    if (detected && detected !== p.lang) p = await savePrefs($, q => ({ ...q, lang: detected }))
    const t = tally((await read($, board)).pending)
    if (total(t) === 0) return next(e)
    await update($, board, b => ({ ...b, pending: EMPTY, hit: null, marks: [] }))
    return next({ ...e, context: [...(e.context ?? []), slapReport(langOf(p), t)] })
  })

  on('ui.message', async ($, e, next) => {
    const data = e.data as { action?: unknown; seq?: unknown } | null
    const action = typeof data?.action === 'string' ? data.action : ''
    if (!ACTIONS.includes(action)) return next(e)
    if (lastSeq.get(e.element) === data?.seq) return {}
    lastSeq.set(e.element, data?.seq)
    await act($, action)
    return {}
  })

  on('command.run', { command: 'slap' }, async ($, e) => {
    const [verb = '', ...rest] = e.args.trim().toLowerCase().split(/\s+/)
    const p = await read($, prefs)
    const s = TEXT[langOf(p)]
    if (verb === 'skin') {
      const want = rest.join(' ')
      const found = want ? SKIN_IDS.find(id => id === want || TEXT.ru.skin[id].toLowerCase() === want || TEXT.en.skin[id].toLowerCase() === want) : nextSkin(p.skin)
      if (!found) return { text: s.skinList(SKIN_IDS.map(id => s.skin[id]).join(', ')) }
      await savePrefs($, q => ({ ...q, skin: found }))
      return { text: s.skinSet(s.skin[found]) }
    }
    if (verb === 'lang') {
      const want = rest[0]
      if (want !== 'ru' && want !== 'en' && want !== 'auto') return { text: s.langUsage }
      const next = await savePrefs($, q => (want === 'auto' ? { ...q, isLangPinned: false } : { ...q, lang: want, isLangPinned: true }))
      return { text: TEXT[langOf(next)].langSet(next.lang, next.isLangPinned) }
    }
    if (verb === 'mute') {
      const next = await savePrefs($, q => ({ ...q, isMuted: !q.isMuted }))
      return { text: s.muted(next.isMuted) }
    }
    if (verb === 'reset') {
      await update($, board, b => ({ ...b, pending: EMPTY, hit: null, marks: [] }))
      return { text: s.reset }
    }
    const hidden = await update($, isHidden, h => !h)
    return { text: hidden ? s.hidden : s.shown }
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey || (await read($, isHidden))) return next(e)
    const below = await next(e)
    const b = await read($, board)
    const p = await read($, prefs)
    const now = await $.clock.now()
    const lang = langOf(p)
    const s = TEXT[lang]
    const pending = total(tally(b.pending))
    const redness = Math.min(1, pending / 10)
    const live = b.hit && now - b.hit.at < HIT_MS ? { ...b.hit, combo: b.hit.combo ?? 1 } : null
    const els = $.ui.resolve(e)
    const { Box, Text, Button } = els
    const Client = 'Client' in els ? els.Client : null
    const Svg = 'Svg' in els ? els.Svg : null

    const overlay = (key: string, action: string, columns: number, rows: number) =>
      Client ? (
        <Box position="absolute" top={0} left={0} right={0} bottom={0}>
          <Client key={`click-${key}`} module="./clicker.tsx" width={columns} height={rows} props={{ action, columns, rows }} />
        </Box>
      ) : null
    const chip = (key: string, action: string, columns: number, icon: RenderChildren, label: RenderChildren) => (
      <Box key={key} position="relative" flexShrink={0} width={columns}>
        <Box width={columns} flexDirection="row" alignItems="center" columnGap={1} paddingX={1} backgroundColor="#2a2a2a" hover={{ backgroundColor: '#3a3a3a' }}>
          {icon}
          {label}
        </Box>
        {overlay(key, action, columns, 1)}
      </Box>
    )

    if (!(await read($, isOpen))) {
      const count = pending > 0 ? ` · ${pending}` : ''
      return (
        <Box flexDirection="column">
          {chip(
            'open',
            'open',
            s.open.length + count.length + 7,
            Svg ? <Svg source={miniButt(p.skin, redness, CHIP_ICON_PX)} alt={s.open} width={CHIP_ICON_PX} height={CHIP_ICON_PX} /> : <Text>🍑</Text>,
            <Text>
              {s.open}
              <Text dimColor>{count}</Text>
            </Text>,
          )}
          {below}
        </Box>
      )
    }

    const art = Svg ? (
      <Box key="art" position="relative" flexShrink={0}>
        <Svg source={scene(p.skin, redness, b.marks, live, lang)} alt={s.artAlt} width={ART.desktop.width} height={ART.desktop.height} isInteractive />
        {Client ? (
          <Box position="absolute" top={0} left={0} width={ART.desktop.columns} height={ART.desktop.rows}>
            <Client key="clicker" module="./clicker.tsx" width={ART.desktop.columns} height={ART.desktop.rows} props={{ action: 'hand', columns: ART.desktop.columns, rows: ART.desktop.rows }} />
          </Box>
        ) : null}
      </Box>
    ) : (
      <Box key="art" position="relative" flexDirection="column" flexShrink={0}>
        {pixelRows(p.skin, redness).map((row, y) => (
          <Text key={`px${y}`}>
            {row.map((c, x) => (
              <Text key={`p${y}-${x}`} color={c.fg} backgroundColor={c.bg}>{c.ch}</Text>
            ))}
          </Text>
        ))}
        {Client ? (
          <Box position="absolute" top={0} left={0} width={ART.terminal.columns} height={ART.terminal.rows}>
            <Client key="clicker" module="./clicker.tsx" width={ART.terminal.columns} height={ART.terminal.rows} props={{ action: 'hand', columns: ART.terminal.columns, rows: ART.terminal.rows }} />
          </Box>
        ) : null}
      </Box>
    )

    const tile = (key: string, action: string, label: string, emoji: string, icon: string, isDim = false) => (
      <Box key={key} position="relative" flexShrink={0} width={TILE.columns}>
        <Box
          width={TILE.columns}
          flexDirection="row"
          alignItems="center"
          columnGap={1}
          paddingLeft={1}
          borderStyle="round"
          borderColor="#3a3a3a"
          hover={{ borderColor: '#d97757', backgroundColor: '#2e2e2e' }}
        >
          {Svg ? <Svg source={icon} alt={label} width={TILE.iconPx} height={TILE.iconPx} /> : <Text>{emoji}</Text>}
          <Text dimColor={isDim} wrap="truncate-end">{label}</Text>
        </Box>
        {overlay(key, action, TILE.columns, TILE.rows)}
      </Box>
    )
    const tiles = TOOL_IDS.map(id => tile(`tile-${id}`, id, s.tool[id].label, TOOL_ART[id].emoji, toolIcon(id, TILE.iconPx)))
    const artColumns = Svg ? ART.desktop.columns : ART.terminal.columns
    const fit = Math.floor((e.props.bodyColumns - artColumns - 2 + TILE.gap) / (TILE.columns + TILE.gap))
    const perRow = Math.max(TILE.minPerRow, Math.min(TILE.maxPerRow, fit))
    const rows: (typeof tiles)[] = []
    for (let i = 0; i < tiles.length; i += perRow) rows.push(tiles.slice(i, i + perRow))
    const grid = (
      <Box key="grid" flexDirection="column" flexShrink={0}>
        {rows.map((row, i) => (
          <Box key={`grid-row-${i}`} flexDirection="row" columnGap={TILE.gap}>
            {row}
          </Box>
        ))}
      </Box>
    )
    const hotkeys = (
      <Box key="hotkeys" display="none">
        {TOOL_IDS.map((id, i) => (
          <Button key={`tool-${id}`} plain hotkey={String(i + 1)} label={s.tool[id].label} onPress={pressing($, id)} />
        ))}
        <Button key="skin" plain hotkey={SKIN_HOTKEY} label={s.skin[p.skin]} onPress={pressing($, 'skin')} />
        <Button key="sound" plain hotkey={SOUND_HOTKEY} label={s.sound(p.isMuted)} onPress={pressing($, 'sound')} />
      </Box>
    )
    const stats = (
      <Text key="stats" dimColor wrap="truncate-end">
        {pending > 0 ? s.pending(pending, b.session) : b.session > 0 ? s.told(b.session) : s.idle}
      </Text>
    )
    return (
      <Box flexDirection="column">
        <Box flexDirection="row" columnGap={2} alignItems="center">
          {art}
          {grid}
        </Box>
        {hotkeys}
        <Box flexDirection="row" columnGap={1}>
          {chip('close', 'close', s.close.length + 2, null, <Text dimColor>{s.close}</Text>)}
          {chip(
            'skin',
            'skin',
            s.skin[p.skin].length + 5,
            Svg ? <Svg source={uiIcon('refresh', SMALL_ICON_PX, '#5aa9ff')} alt={s.skin[p.skin]} width={SMALL_ICON_PX} height={SMALL_ICON_PX} /> : <Text>🔄</Text>,
            <Text>{s.skin[p.skin]}</Text>,
          )}
          {chip(
            'sound',
            'sound',
            s.sound(p.isMuted).length + 5,
            Svg ? (
              <Svg source={uiIcon(p.isMuted ? 'volume-off' : 'volume', SMALL_ICON_PX, p.isMuted ? '#8a8a8a' : '#e6e6e6')} alt={s.sound(p.isMuted)} width={SMALL_ICON_PX} height={SMALL_ICON_PX} />
            ) : (
              <Text>{p.isMuted ? '🔇' : '🔊'}</Text>
            ),
            <Text dimColor={p.isMuted}>{s.sound(p.isMuted)}</Text>,
          )}
          <Box marginLeft={1}>{stats}</Box>
        </Box>
        {below}
      </Box>
    )
  })
}
