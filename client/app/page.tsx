import Header from "@/components/Header";
import Inputs from "@/components/Inputs";
import TShirt3D from "@/components/Tshirt3D";
import TshirtProvider from "./context/ThshirtContext";

export default function Home() {
  return (
    <div className="absolute inset-0 h-full w-full z-10">
      <Header />
      <TshirtProvider>
        <TShirt3D />
        <Inputs />
      </TshirtProvider>
    </div>
  );
}
