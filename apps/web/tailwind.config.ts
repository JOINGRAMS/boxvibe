import type { Config } from 'tailwindcss'
import sharedConfig from '@boxvibe/config/tailwind'

const config: Config = {
  // Scan all app files + shared packages for class usage
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  presets: [sharedConfig],
}

export default config
