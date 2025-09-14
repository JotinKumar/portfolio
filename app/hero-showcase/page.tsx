import HeroSplit from "@/components/sections/hero/HeroSplit";

export default function HeroShowcase() {
  return (
    <div
      className="w-full flex justify-center items-center"
      style={{ minHeight: "calc(100vh - 56px)" }}
    >
      <HeroSplit />
    </div>
  );
}
