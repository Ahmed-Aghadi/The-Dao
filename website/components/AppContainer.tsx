import { AppShell, Navbar, Header } from "@mantine/core";
import { HeaderTabsColored } from "./Headers";

export function AppContainer({ children }: { children: React.ReactNode }) {
    // Navbar and Header will not be rendered when hidden prop is set
    return (
        <AppShell
            // navbar={<Navbar />}
            //  header={<Header />}
            header={<HeaderTabsColored />}
            // styles={(theme) => ({
            //     main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
            //   })}
            //   padding="md"
            // @ts-ignore
            padding="0"
        >
            {children}
        </AppShell>
    );
}
