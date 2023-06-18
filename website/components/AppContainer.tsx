import { AppShell } from "@mantine/core";
import { HeaderTabsColored } from "./Headers";

export function AppContainer({ children }: { children: React.ReactNode }) {
  // Navbar and Header will not be rendered when hidden prop is set
  return (
    <AppShell
      header={<HeaderTabsColored />}
      // @ts-ignore
      padding="0"
    >
      {children}
    </AppShell>
  );
}
