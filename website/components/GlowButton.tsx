import { daoFactoryContractAddress, dataDaoAbi, rpcUrl } from "@/constants";
import { Center, createStyles, Skeleton, Stack, Text } from "@mantine/core";
import { Icon3dCubeSphere } from "@tabler/icons";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import stylesModule from "@/styles/GlowButton.module.css";

type GlowButtonProps = {
    text: string;
    styles?: React.CSSProperties;
    onClick: () => void;
};

export function GlowButton({ text, styles, onClick }: GlowButtonProps) {
    useEffect(() => {
        (function setGlowEffectRx() {
            const glowEffects = window.document.querySelectorAll(
                `.${stylesModule["glow-effect"]}`
            );
            console.log(glowEffects);
            glowEffects.forEach((glowEffect) => {
                const glowLines = glowEffect.querySelectorAll("rect");
                const rx = getComputedStyle(glowEffect).borderRadius;

                glowLines.forEach((line) => {
                    line.setAttribute("rx", rx);
                });
            });
        })();
    }, []);
    return (
        <button
            className={`${stylesModule["button"]} ${stylesModule["glow-effect"]}`}
            style={styles}
            data-glow-offset="true"
            onClick={onClick}
            onMouseEnter={(e) => {
                console.log(e);
            }}
        >
            {text}
            <svg className={`${stylesModule["glow-container"]}`}>
                <rect
                    pathLength="100"
                    strokeLinecap="round"
                    className={`${stylesModule["glow-blur"]}`}
                ></rect>
                <rect
                    pathLength="100"
                    strokeLinecap="round"
                    className={`${stylesModule["glow-line"]}`}
                ></rect>
            </svg>
        </button>
    );
}
