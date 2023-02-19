import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";

import "@rainbow-me/rainbowkit/styles.css";
import {
    getDefaultWallets,
    RainbowKitProvider,
    darkTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig, Chain } from "wagmi";
import { mainnet, polygon, optimism, arbitrum } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { NotificationsProvider } from "@mantine/notifications";

const hyperspaceTestnet: Chain = {
    id: 3141,
    name: "Hyperspace",
    network: "Hyperspace",
    nativeCurrency: {
        decimals: 18,
        name: "Filecoin",
        symbol: "tFIL",
    },
    rpcUrls: {
        default: "https://api.hyperspace.node.glif.io/rpc/v1",
    },
    testnet: true,
};

const { chains, provider } = configureChains(
    [hyperspaceTestnet],
    [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
    appName: "My RainbowKit App",
    chains,
});

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
});
export default function App({ Component, pageProps }: AppProps) {
    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains} theme={darkTheme()}>
                <NotificationsProvider position="top-right" zIndex={2077}>
                    <MantineProvider
                        withGlobalStyles
                        withNormalizeCSS
                        theme={{ colorScheme: "dark" }}
                    >
                        <Component {...pageProps} />
                    </MantineProvider>
                </NotificationsProvider>
            </RainbowKitProvider>
        </WagmiConfig>
    );
}
