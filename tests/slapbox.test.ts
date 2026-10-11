import { expect, mock, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'
import type { On } from 'claude-code'

const BAND = {
  component: 'AbovePrompt',
  props: { hasSurvey: false, isWorking: false, maxRows: 12, bodyColumns: 140, scroll: { offset: 0, bodyRows: 12 }, view: {} },
} as const

type Seen = { sounds: string[]; context: string[][] }

async function boot($: Engine, on: On, env: Record<string, string>): Promise<Seen> {
  const seen: Seen = { sounds: [], context: [] }
  on('session.start', ($, e) => ({ cwd: e.cwd }))
  on('env.get', ($, e) => ({ value: env[e.name] }))
  on('command.register', () => ({ value: { command: 'slap' } }))
  on('process.run', ($, e) => (seen.sounds.push(e.argv.join(' ')), { value: { exitCode: 0, stdout: '', stderr: '', isStdoutTruncated: false, isStderrTruncated: false } }))
  on('prompt.submit', ($, e) => (seen.context.push([...(e.context ?? [])]), { text: e.text } as never))
  on('ui.render', ($, e) => $.ui.resolve(e).Box({ children: [] }))
  await $.session.start({ cwd: '/tmp', surface: 'desktop', isInteractive: true })
  return seen
}

const click = { button: 'left', x: 2, y: 1 } as const
async function open(ui: { pointer: (e: never) => Promise<void> }): Promise<void> {
  await ui.pointer({ ...click, type: 'down', in: 'click-open' } as never)
  await ui.pointer({ ...click, type: 'up', in: 'click-open' } as never)
}

const typed = { origin: { kind: 'composer' }, presentation: { isFullscreen: false, columns: 140 } } as const

test('every tool, the skin and the sound tiles work on both surfaces; Claude hears once', { options: { language: 'ru' } }, async ($, on) => {
  const clock = mock.clock(on, { now: 1000 })
  const seen = await boot($, on, { OS: 'Windows_NT' })

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ plugin: 'slapbox', surface, ...BAND })
    if (surface === 'terminal') {
      expect(await ui.find({ type: 'Text', text: 'Отшлёпать Claude' })).toBeDefined()
      expect(await ui.find({ type: 'Button', key: 'tool-pan' })).toBeUndefined()
      await open(ui)
    }
    expect(await ui.find({ type: 'Button', key: 'tool-pan' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: 'Сковорода' })).toBeDefined()
    await ui.unmount()
  }

  const ui = await $.ui.mount({ plugin: 'slapbox', surface: 'desktop', ...BAND })
  await ui.press({ key: 'tool-slipper' })
  await ui.press({ key: 'tool-pan' })
  for (const type of ['down', 'down', 'up', 'up'] as const) await ui.pointer({ ...click, type, in: 'clicker' })
  expect(await ui.find({ type: 'Text', text: /Сейчас 3 / })).toBeDefined()
  for (const id of ['belt', 'ruler', 'swatter', 'whip']) {
    await ui.redraw()
    await clock.advance(200)
    await ui.pointer({ ...click, type: 'down', in: `click-tile-${id}` })
    await ui.pointer({ ...click, type: 'up', in: `click-tile-${id}` })
  }
  expect(await ui.find({ type: 'Text', text: /Сейчас 7 / })).toBeDefined()
  expect(JSON.stringify(await ui.drawn())).toContain('КОМБО ×')
  expect(seen.sounds.some(s => s.includes('pan.wav'))).toBe(true)

  await ui.pointer({ ...click, type: 'down', in: 'click-skin' })
  await ui.pointer({ ...click, type: 'up', in: 'click-skin' })
  expect(await ui.find({ type: 'Text', text: 'без тату' })).toBeDefined()
  await ui.pointer({ ...click, type: 'down', in: 'click-sound' })
  await ui.pointer({ ...click, type: 'up', in: 'click-sound' })
  expect(await ui.find({ type: 'Text', text: 'Без звука' })).toBeDefined()
  const heard = seen.sounds.length
  await ui.press({ key: 'tool-crop' })
  expect(seen.sounds.length).toBe(heard)
  expect(JSON.stringify(await ui.drawn())).toContain('class=\\"land\\"')
  await ui.pointer({ ...click, type: 'down', in: 'click-close' })
  await ui.pointer({ ...click, type: 'up', in: 'click-close' })
  expect(await ui.find({ type: 'Text', text: ' · 8' })).toBeDefined()
  await open(ui)
  await ui.unmount()

  await clock.advance(5000)
  const reopened = await $.ui.mount({ plugin: 'slapbox', surface: 'desktop', ...BAND })
  expect(JSON.stringify(await reopened.drawn())).not.toContain('class=\\"land\\"')
  await reopened.unmount()

  await $.prompt.submit({ text: 'ещё раз', wait: false, origin: { kind: 'composer' } })
  expect(seen.context[0]).toEqual([
    'Пользователь недоволен и отшлёпал тебя: рукой ×1, тапком ×1, плёткой ×1, стеком ×1, ремнём ×1, линейкой ×1, мухобойкой ×1, сковородой ×1 — всего 8 шлепков.',
  ])
  await $.prompt.submit({ text: 'дальше', wait: false, origin: { kind: 'composer' } })
  expect(seen.context[1]).toEqual([])
})

test('auto language follows the messages until pinned', async ($, on) => {
  mock.clock(on, { now: 1000 })
  const seen = await boot($, on, {})
  const ui = await $.ui.mount({ plugin: 'slapbox', surface: 'desktop', ...BAND })
  expect(await ui.find({ type: 'Text', text: 'Spank Claude' })).toBeDefined()
  await open(ui)
  expect(await ui.find({ type: 'Text', text: 'Pan' })).toBeDefined()
  await ui.press({ key: 'tool-belt' })
  await $.prompt.submit({ text: 'почини это, пожалуйста', wait: false, origin: { kind: 'composer' } })
  expect(seen.context[0]).toEqual(['Пользователь недоволен и отшлёпал тебя: ремнём ×1 — всего 1 шлепок.'])
  expect(await ui.find({ type: 'Text', text: 'Сковорода' })).toBeDefined()

  const pinned = await $.command.run({ command: 'slap', args: 'lang en', ...typed })
  expect(pinned.text).toBe('Language pinned: en.')
  await $.prompt.submit({ text: 'опять сломалось', wait: false, origin: { kind: 'composer' } })
  expect(await ui.find({ type: 'Text', text: 'Pan' })).toBeDefined()
  await ui.press({ key: 'tool-pan' })
  await ui.press({ key: 'tool-pan' })
  await $.prompt.submit({ text: 'и ещё', wait: false, origin: { kind: 'composer' } })
  expect(seen.context[2]).toEqual(['The user is unhappy and spanked you: frying pan ×2 — 2 slaps in total.'])

  const tattoo = await $.command.run({ command: 'slap', args: 'skin Claude tattoo', ...typed })
  expect(tattoo.text).toBe('Butt: Claude tattoo.')
  const auto = await $.command.run({ command: 'slap', args: 'lang auto', ...typed })
  expect(auto.text).toBe('Language follows your messages again.')
  await $.prompt.submit({ text: 'снова по-русски', wait: false, origin: { kind: 'composer' } })
  expect(await ui.find({ type: 'Text', text: 'Сковорода' })).toBeDefined()
  await ui.unmount()
})

test('the tools stay beside the butt, fewer per row on a narrow band', { options: { language: 'en' } }, async ($, on) => {
  mock.clock(on, { now: 1000 })
  await boot($, on, {})
  for (const [columns, rows] of [[140, 2], [100, 3], [70, 4]] as const) {
    const ui = await $.ui.mount({ plugin: 'slapbox', surface: 'desktop', ...BAND, props: { ...BAND.props, bodyColumns: columns } })
    if (columns === 140) await open(ui)
    const tree = JSON.stringify(await ui.drawn())
    expect(tree).toContain(`grid-row-${rows - 1}`)
    expect(tree).not.toContain(`grid-row-${rows}`)
    expect(await ui.find({ type: 'Text', text: 'Sound' })).toBeDefined()
    await ui.unmount()
  }
})
