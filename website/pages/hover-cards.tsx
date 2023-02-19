import { HoverCards } from "@/components/HoverCards";

export default function Home() {
    const divs = Array.from(Array(12)).map((_, index) => {
        return (
            <div
                key={index}
                style={{
                    color: "rgb(240, 240, 240)",
                }}
            >
                {index}
            </div>
        );
    });
    return (
        <div
            style={
                {
                    // backgroundColor: "rgb(20, 20, 20)",
                    // backgroundColor: "black",
                    // height: "100vh",
                    // width: "100vw",
                }
            }
        >
            <HoverCards divs={divs} />
        </div>
    );
}
