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
    { name: 'Desert radio', title: 'No internet.\nStill a little music.', description: '', hint: 'Sound on. Turn the dial. Find a little music while you wait.', theme: 'navy', layout: 'reverse' },
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
    { name: 'A loose screw', title: 'One small\nloose end.', description: 'Something went wrong on our side. A fresh attempt might put things right.', hint: 'Give the loose screw three quarter turns.', theme: 'paper', layout: 'split' },
    { name: 'Built again', title: 'Good things\nget rebuilt.', description: 'This page hit a snag. There’s always another way to put the pieces together.', hint: 'Place the four blocks back into the arch.', theme: 'navy', layout: 'reverse' },
    { name: 'A little rewind', title: 'Let’s take\nthat again.', description: 'Something slipped between frames. Roll it back and give it another try.', hint: 'Rewind the picture until the lines align.', theme: 'paper', layout: 'split' },
    { name: 'The switchboard', title: 'A brief\ninterruption.', description: 'A little fault in the circuit. We’ll try the page again when you’re ready.', hint: 'Flip the three switches to light up the board.', theme: 'red', layout: 'poster' },
    { name: 'Soft landing', title: 'A stumble.\nA soft landing.', description: 'The page didn’t quite stick the landing. Let’s give it another chance.', hint: 'Drop the gold ball into the little safety net.', theme: 'paper', layout: 'reverse' },
    { name: 'The reset ritual', title: 'A fresh\nstarting point.', description: 'Something went off track. Sometimes a small reset is all it takes.', hint: 'Turn the key to reset the illustration.', theme: 'navy', layout: 'split' },
    { name: 'A stitch in time', title: 'Just a little\nmending.', description: 'Something came apart. A few stitches, a little patience, another attempt.', hint: 'Stitch the four gold points back together.', theme: 'paper', layout: 'poster' },
    { name: 'Shift in perspective', title: 'Almost\nin alignment.', description: 'This page isn’t quite where it should be. A fresh perspective could help.', hint: 'Shift the layers until the arch becomes whole.', theme: 'red', layout: 'split' },
    { name: 'A second impression', title: 'Not every\nfirst print lands.', description: 'Something went wrong. The next impression could be the good one.', hint: 'Press the stamp to make a fresh impression.', theme: 'paper', layout: 'reverse' },
    { name: 'The second draft', title: 'Room for\na better draft.', description: 'Even thoughtful things need a second pass. Let’s try this page again.', hint: 'Erase the scribble to reveal a new beginning.', theme: 'navy', layout: 'split' },
  ],
}
