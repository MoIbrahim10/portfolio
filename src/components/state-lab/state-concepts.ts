export type StateKind = '404' | 'offline' | 'error'

export interface StateConcept {
  name: string
  title: string
  description: string
  hint: string
  theme: 'paper' | 'navy' | 'red'
  layout: 'split' | 'reverse' | 'poster'
}

export const STATE_LABELS: Record<StateKind, string> = {
  '404': 'Page not found',
  offline: 'No internet',
  error: 'Something went wrong',
}

export const CONCEPTS: Record<StateKind, StateConcept[]> = {
  '404': [
    { name: 'The hidden doorway', title: 'A beautiful wrong turn.', description: '', hint: 'Tap the doors, or pull them apart.', theme: 'paper', layout: 'split' },
    { name: 'Solar compass', title: 'Lost, but\nnot for long.', description: '', hint: 'Move to guide. Flick to spin. Find north.', theme: 'navy', layout: 'reverse' },
  ],
  offline: [
    { name: 'An untangled moment', title: 'A little disconnected.', description: '', hint: 'Pull each brass plug into its socket.', theme: 'paper', layout: 'split' },
    { name: 'Desert radio', title: 'No internet.\nStill on the air.', description: '', hint: 'Power on. Turn the dial. Three stations, no internet needed.', theme: 'paper', layout: 'reverse' },
    { name: 'A little oasis', title: 'Offline. Still growing.', description: '', hint: 'Tap the water. Watch a little oasis grow.', theme: 'paper', layout: 'split' },
    { name: 'The slow sun', title: 'The world can wait.', description: '', hint: 'Carry the sun across the desert.', theme: 'red', layout: 'poster' },
    { name: 'Sand, uninterrupted', title: 'Leave a little trace.', description: '', hint: 'Draw in the sand. Double-tap to start fresh.', theme: 'paper', layout: 'reverse' },
    { name: 'Local stars', title: 'A sky of your own.', description: '', hint: 'Brush over the stars, or tap to light them.', theme: 'navy', layout: 'split' },
    { name: 'Airplane mode', title: 'Let your mind wander.', description: '', hint: 'Aim the paper plane. Tap to send it flying.', theme: 'paper', layout: 'poster' },
    { name: 'A quiet rhythm', title: 'Find a little rhythm.', description: '', hint: 'Play the four tiles. Turn sound on to listen.', theme: 'red', layout: 'split' },
    { name: 'Small balance', title: 'A moment of balance.', description: '', hint: 'Tap the stones. Build three equal columns.', theme: 'paper', layout: 'reverse' },
    { name: 'A note to nowhere', title: 'A thought can wait.', description: '', hint: 'Write on the postcard. Seal it with a little sun.', theme: 'navy', layout: 'split' },
  ],
  error: [
    { name: 'Clockwork sun', title: 'Something went wrong.', description: 'This page couldn’t load. Let’s try again.', hint: 'Wind the wheel to retry.', theme: 'red', layout: 'split' },
    { name: 'Built again', title: 'Something went wrong.', description: 'This page couldn’t load. Let’s try again.', hint: 'Rebuild the arch to retry.', theme: 'navy', layout: 'reverse' },
    { name: 'Soft landing', title: 'Something went wrong.', description: 'This page couldn’t load. Let’s try again.', hint: 'Catch the sun to retry.', theme: 'paper', layout: 'reverse' },
  ],
}
