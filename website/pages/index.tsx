import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Index.module.css";
const inter = Inter({ subsets: ["latin"] });
import { useEffect, useLayoutEffect, useRef, useState } from "react";
// @ts-ignore
import anime from "animejs";
import { Button, Center, Container } from "@mantine/core";
import { CursorTail } from "@/components/CursorTail";
import { HackedText } from "@/components/HackedText";
import { GlowButton } from "@/components/GlowButton";
import { useRouter } from "next/router";

export default function Home() {
    const tileRef = useRef<HTMLDivElement>(null);
    const [isToggle, setIsToggle] = useState(false);
    const [tiles, setTiles] = useState<JSX.Element[]>([]);
    const router = useRouter();
    useEffect(() => {
        const wrapper = tileRef.current!;

        let columns = 0,
            rows = 0,
            toggled = false;

        const toggle = () => {
            toggled = !toggled;
            setIsToggle(toggled);
        };

        const handleOnClick = (index: number) => {
            toggle();

            anime({
                targets: ".tile",
                opacity: toggled ? 0 : 1,
                delay: anime.stagger(50, {
                    grid: [columns, rows],
                    from: index,
                }),
            });
        };

        const createTile = (index: number) => {
            const tile = (
                // setting the key to index is a bad idea
                <div
                    key={Math.random()}
                    className={styles.tile + " tile"}
                    style={{ opacity: toggled ? 0 : 1 }}
                    onClick={() => handleOnClick(index)}
                ></div>
            );
            return tile;
        };

        const createTiles = (quantity: number) => {
            Array.from(Array(quantity)).map((tile, index) => {
                setTiles((tiles) => [...tiles, createTile(index)]);
            });
        };

        const createGrid = () => {
            wrapper.innerHTML = "";

            const size = document.body.clientWidth > 800 ? 100 : 50;

            columns = Math.floor(document.body.clientWidth / size);
            rows = Math.floor(document.body.clientHeight / size);

            wrapper.style.setProperty("--columns", columns.toString());
            wrapper.style.setProperty("--rows", rows.toString());

            createTiles(columns * rows);
        };

        createGrid();

        window.onresize = () => createGrid();
    }, [tileRef]);

    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <CursorTail />
            <main
                className={
                    styles.main + " " + (isToggle ? styles.toggled : " ")
                }
            >
                <div id={styles.tiles} ref={tileRef}>
                    {tiles}
                </div>
                <Container
                    size="sm"
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 100,
                        pointerEvents: "none",
                    }}
                >
                    <h1 id={styles.title}>
                        <HackedText
                            style={{
                                pointerEvents: "all",
                            }}
                            value="The Dao"
                            useDefaultStyle
                        />
                    </h1>
                    <Center>
                        {/* <Button
                            variant="gradient"
                            gradient={{ from: "teal", to: "lime", deg: 105 }}
                            m="md"
                            sx={{
                                // position: "absolute",
                                // top: "50%",
                                // left: "50%",
                                // // transform: "translate(-50%, -50%)",
                                // zIndex: 100,
                                pointerEvents: "all",
                            }}
                            onClick={() => console.log("clicked")}
                            component="a"
                            href="/home"
                        >
                            Go To Home Page
                        </Button> */}
                        <GlowButton
                            styles={{
                                pointerEvents: "all",
                            }}
                            text="Go To Home Page"
                            onClick={() => {
                                console.log("clicked");
                                router.push("/home");
                            }}
                        />
                    </Center>
                    <Center>
                        <Button
                            m="md"
                            variant="default"
                            size="md"
                            // gradient={{ from: "teal", to: "lime", deg: 105 }}
                            sx={{
                                // position: "absolute",
                                // top: "50%",
                                // left: "50%",
                                // // transform: "translate(-50%, -50%)",
                                // zIndex: 100,
                                pointerEvents: "all",
                                "&:hover": {
                                    color: "white",
                                },
                            }}
                            onClick={() => console.log("clicked")}
                            component="a"
                            href="/home"
                        >
                            Source Code
                        </Button>
                    </Center>
                </Container>

                <i
                    id={styles.icon}
                    className={`${styles["fa-solid"]} ${styles["fa-chess"]} ${styles.centered}`}
                ></i>
            </main>
        </>
    );
}
