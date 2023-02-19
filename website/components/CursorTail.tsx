import styles from "@/styles/Cursor.module.css";
import { useEffect, useLayoutEffect, useState } from "react";

const colors = [
    "#ffb56b",
    "#fdaf69",
    "#f89d63",
    "#f59761",
    "#ef865e",
    "#ec805d",
    "#e36e5c",
    "#df685c",
    "#d5585c",
    "#d1525c",
    "#c5415d",
    "#c03b5d",
    "#b22c5e",
    "#ac265e",
    "#9c155f",
    "#950f5f",
    "#830060",
    "#7c0060",
    "#680060",
    "#60005f",
    "#48005f",
    "#3d005e",
];

export function CursorTail() {
    const circlesRef = useState<HTMLDivElement>();
    useEffect(() => {
        if (!circlesRef) {
            return;
        }
        const coords = { x: 0, y: 0 };
        const circlesProps: {
            x: number;
            y: number;
        }[] = [];

        for (let i = 0; i < circlesRef.length; i++) {
            circlesProps[i] = {
                x: 0,
                y: 0,
            };
        }

        for (let i = 0; i < circlesRef.length; i++) {
            const currentCircleRef = circlesRef[i];
            if ("style" in currentCircleRef!) {
                currentCircleRef!.style.backgroundColor =
                    colors[i % colors.length];

                currentCircleRef!.style.opacity = "0";
                currentCircleRef!.style.left = "0px";
                currentCircleRef!.style.top = "0px";
            }
        }

        window.addEventListener("mousemove", function (e) {
            coords.x = e.clientX;
            coords.y = e.clientY;
            for (let i = 0; i < circlesRef.length; i++) {
                const currentCircleRef = circlesRef[i];
                if (currentCircleRef && "style" in currentCircleRef!) {
                    currentCircleRef!.style.opacity = "1";
                }
            }
        });

        window.addEventListener("mouseout", function (e) {
            for (let i = 0; i < circlesRef.length; i++) {
                const currentCircleRef = circlesRef[i];
                if (currentCircleRef && "style" in currentCircleRef!) {
                    currentCircleRef!.style.opacity = "0";
                }
            }
        });

        const animateCircles = () => {
            let x = coords.x;
            let y = coords.y;

            for (let i = 0; i < circlesRef.length; i++) {
                const nextCircle = circlesProps[i + 1] || circlesProps[0];
                x += (nextCircle.x - x) * 0.3;
                y += (nextCircle.y - y) * 0.3;
                circlesProps[i].x = x;
                circlesProps[i].y = y;
                if (!circlesRef[i]) return;

                const currentCircleRef = circlesRef[i];
                if ("style" in currentCircleRef!) {
                    currentCircleRef!.style.left = x - 12 + "px";
                    currentCircleRef!.style.top = y - 12 + "px";
                    currentCircleRef!.style.transform = `scale(${
                        (circlesRef.length - i) / circlesRef.length
                    })`;
                }
            }

            requestAnimationFrame(animateCircles);
        };

        animateCircles();
    }, [circlesRef]);

    const circles = [];
    for (let i = 0; i < 20; i++) {
        circles.push(
            <div
                key={i}
                className={styles.circle}
                style={{ opacity: 0 }}
                ref={(ref) => (circlesRef[i] = ref!)}
            ></div>
        );
    }
    return <>{circles}</>;
}
