# Farscry

A simple, private, cross-platform video calling app. No chat. No bloat. Just calls.

## Why?

Every cross-platform video calling option today is either a full messenger, a big tech product, or a conferencing tool. There's no simple, private, cross-platform video phone call app — just contacts, favorites, tap to ring, great video quality. That's the gap.

## Features

- **Just calls** — no chat, no stories, no social features
- **Native feel** — integrates with iOS Phone app (favorites, recents, Siri) and Android's native call UI
- **Privacy-first** — E2EE by default, minimal metadata, no analytics
- **Cross-platform** — iOS and Android with feature parity

## Architecture

```
Mobile App (React Native) ←→ Signaling Server (Node.js) ←→ Mobile App
                    ↕                                        ↕
                    └──────── WebRTC P2P (E2EE) ────────────┘
                                      │
                              Cloudflare TURN
                              (relay fallback)
```

- **Mobile**: React Native + TypeScript, react-native-webrtc, CallKit/ConnectionService
- **Signaling**: Lightweight WebSocket server — brokers call setup, never touches media
- **Media**: Direct P2P via WebRTC with DTLS-SRTP encryption
- **Relay**: Cloudflare TURN/STUN for NAT traversal when P2P fails (~10-20% of calls)

## Project Structure

```
farscry/
├── apps/
│   └── mobile/              # React Native app (iOS + Android)
├── packages/
│   ├── signaling/           # WebSocket signaling server
│   └── shared/              # Shared types and constants
├── package.json             # npm workspaces root
└── .github/workflows/       # CI/CD
```

## Getting Started

### Prerequisites

- Node.js >= 22
- Xcode (for iOS builds)
- Android Studio (for Android builds)
- CocoaPods (`gem install cocoapods`)

### Setup

```bash
# Install all dependencies
npm install

# Start the signaling server (dev mode)
npm run server:dev

# Start Metro bundler for mobile app
npm run mobile:start

# Run on iOS
npm run mobile:ios

# Run on Android
npm run mobile:android
```

## Development

```bash
# Run all tests
npm test

# Typecheck all packages
npm run typecheck

# Lint all packages
npm run lint
```

## Privacy

- All calls are end-to-end encrypted via WebRTC DTLS-SRTP
- The signaling server only brokers the initial handshake — no media passes through it
- Minimal data stored: user ID, display name, push tokens
- No call metadata logging, no analytics, no tracking

## License

MIT
