/* @jsx h */
import type { ClientSurface } from 'claude-code'

type Props = { action: string; columns: number; rows: number }

const MIN_GAP_MS = 50

const isPressed = new WeakMap<object, boolean>()
const lastPostAt = new WeakMap<object, number>()
let seq = 0

export default function Clicker(props: Props, surface: ClientSurface) {
  const { Box, Text } = surface.elements
  const action = props.action
  surface.onPointer(event => {
    if (event.button === 'right') return
    if (event.type === 'down') {
      isPressed.set(surface, true)
      return
    }
    if (event.type !== 'up' || !isPressed.get(surface)) return
    isPressed.set(surface, false)
    const now = Date.now()
    if (now - (lastPostAt.get(surface) ?? 0) < MIN_GAP_MS) return
    lastPostAt.set(surface, now)
    seq += 1
    surface.post({ action, seq })
  })
  return (
    <Box width={props.columns} height={props.rows}>
      <Text> </Text>
    </Box>
  )
}
