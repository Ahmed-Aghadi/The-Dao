import React, { useState } from "react";
import styles from "@/styles/HoverCards.module.css";
import { useRouter } from "next/router";

type HoverCardsProps = {
    divs: JSX.Element[];
    hrefs?: string[];
    containerStyle?: React.CSSProperties;
    cardStyle?: React.CSSProperties;
};

export function HoverCards({
    divs,
    hrefs,
    containerStyle,
    cardStyle,
}: HoverCardsProps) {
    const divRefs = useState<HTMLDivElement>();
    const router = useRouter();
    return (
        <div
            id={styles.cards}
            className={styles.container}
            style={containerStyle}
            onMouseMove={(e) => {
                for (const div of divRefs) {
                    // @ts-ignore
                    if (!div?.getBoundingClientRect) {
                        continue;
                    }
                    // @ts-ignore
                    const rect = div.getBoundingClientRect(),
                        x = e.clientX - rect.left,
                        y = e.clientY - rect.top;

                    // @ts-ignore
                    div.style.setProperty("--mouse-x", `${x}px`);
                    // @ts-ignore
                    div.style.setProperty("--mouse-y", `${y}px`);
                }
            }}
        >
            {divs.map((div, index) => {
                return (
                    <div
                        key={index}
                        className={styles.card}
                        style={cardStyle}
                        ref={(ref) => (divRefs[index] = ref!)}
                        onClick={() => {
                            if (hrefs) {
                                router.push(hrefs[index]);
                            }
                        }}
                    >
                        <div className={styles["card-content"]}>{div}</div>
                    </div>
                );
            })}
        </div>
    );
}
