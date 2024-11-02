import { TamaguiProvider } from 'tamagui'
import config from '../app/tamagi.config' 

export function Provider({ children }: { children: React.ReactNode }) {
  return <TamaguiProvider config={config}>{children}</TamaguiProvider>
}