# CipherShield Advanced Frontend (v3.0)

Professional cybersecurity dashboard with 3D visualization, real-time encryption, and modern UI/UX.

## Features

### 🎯 Core Features
- **Professional Dashboard UI** - Modern SaaS-style interface
- **3D Cyber Visualization** - Floating data nodes with Three.js
- **Real-time Encryption** - AES-256-GCM integration
- **Smooth Animations** - Framer Motion animations throughout
- **Terminal Logs** - Live system logs panel
- **Responsive Design** - Works on desktop and mobile

### 🔐 Encryption Management
- Generate secure AES-256 encryption keys
- Real-time message encryption
- Message decryption with nonce/tag verification
- Encryption history tracking (50 max entries)
- Copy-to-clipboard functionality

### 🎮 Educational Simulation
- Cyber attack simulation
- Network packet interception visualization
- Brute force analysis display
- Real-world security examples

### 📊 Dashboard Sections
1. **Encrypt** - Message encryption with key management
2. **Decrypt** - Secure message decryption
3. **History** - Persistent encryption history
4. **Simulation** - Attack simulation & security education
5. **About** - Cryptography information & features

## Tech Stack

- **Framework**: React 18.2 + TypeScript
- **3D Graphics**: Three.js + React Three Fiber
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
cd frontend-advanced
npm install
```

### Development

```bash
npm run dev
```

Starts dev server at `http://localhost:5173` with API proxy to `http://localhost:8000`

### Build

```bash
npm run build
```

Builds optimized production bundle to `../frontend/dist`

## Project Structure

```
frontend-advanced/
├── src/
│   ├── api/              # API integration (cipherApi.ts)
│   ├── components/
│   │   ├── 3D/          # 3D visualization (CyberSpace.tsx)
│   │   ├── panels/      # Feature panels (Encrypt, Decrypt, etc.)
│   │   ├── Sidebar.tsx  # Navigation sidebar
│   │   └── SystemLogs.tsx
│   ├── store/           # Zustand state management
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # React entry point
│   └── index.css        # Global styles
├── index.html           # HTML entry point
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind CSS config
├── tsconfig.json        # TypeScript config
└── package.json         # Dependencies
```

## Key Components

### CyberSpace (3D)
- Floating data nodes representing network packets
- Grid floor visualization
- Dual lighting (cyan and magenta)
- Responsive to active/inactive states

### Sidebar Navigation
- 5 main sections with hover animations
- Mobile-friendly with toggle
- Active indicator animation
- Color-coded sections

### State Management (Zustand)
- Centralized encryption state
- History management
- System logs
- Tab navigation

### Panel Components
- **EncryptPanel**: Key generation & message encryption
- **DecryptPanel**: Ciphertext decryption
- **HistoryPanel**: Encryption history browser
- **SimulationPanel**: Attack simulation
- **AboutPanel**: Educational content

## API Integration

Connects to FastAPI backend at `http://localhost:8000`:

```
POST /api/cipher/generate-key
POST /api/cipher/encrypt
POST /api/cipher/decrypt
```

## Animations

- Loading spinner (rotating border)
- Panel transitions (fade + slide)
- Button interactions (scale + glow)
- History list animations
- 3D rotation and floating effects

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Mobile Responsive

- Breakpoints: 480px, 640px, 768px, 1200px
- Touch-friendly interface
- Mobile sidebar with overlay
- Optimized panel layouts

## Performance

- ~150KB gzipped bundle
- 60fps animations
- Lazy loading for components
- Optimized Three.js rendering

## Future Enhancements

- Dark/Light mode toggle
- Export encrypted data
- Multiple algorithm support
- Performance metrics dashboard
- Key rotation
- Batch encryption
- Advanced KDFs
- i18n support

## License

Proprietary - CipherShield 2026
