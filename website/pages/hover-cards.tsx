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
    <div>
      <HoverCards divs={divs} />
    </div>
  );
}
