import React from "react";
import styles from "@/styles/HackedText.module.css";

type HackedTextProps = {
    style?: React.CSSProperties;
    className?: string;
    useDefaultStyle?: boolean;
    value: string;
};

export function HackedText({
    style,
    className,
    value,
    useDefaultStyle,
}: HackedTextProps) {
    return (
        <span
            className={
                (useDefaultStyle ? styles.text : "") +
                " " +
                (className ? className : "")
            }
            style={style}
            data-value={value} // should be the same as the textContent
            onMouseOver={(event) => {
                const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                let interval: NodeJS.Timer | null = null;
                let iteration = 0;

                clearInterval(interval!);

                interval = setInterval(() => {
                    // @ts-ignore
                    event.target!.innerText = event
                        // @ts-ignore
                        .target!.innerText.split("")
                        .map((letter: string, index: number) => {
                            if (index < iteration) {
                                // @ts-ignore
                                return event.target!.dataset.value![index];
                            }

                            return letters[Math.floor(Math.random() * 26)];
                        })
                        .join("");

                    // @ts-ignore
                    if (iteration >= event.target!.dataset.value!.length) {
                        clearInterval(interval!);
                    }

                    iteration += 1 / 3;
                }, 30);
            }}
        >
            {value}
        </span>
    );
}
