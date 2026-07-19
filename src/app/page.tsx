import { CustomCursor } from "@/components/effects/CustomCursor";
import { LoadingScreen } from "@/components/effects/LoadingScreen";
import { MouseGlow } from "@/components/effects/MouseGlow";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import { SpaceBackground } from "@/components/effects/SpaceBackground";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Community } from "@/components/sections/Community";
import { ContractAddress } from "@/components/sections/ContractAddress";
import { FAQ } from "@/components/sections/FAQ";
import { Hero } from "@/components/sections/Hero";
import { MeetNibbo } from "@/components/sections/MeetNibbo";
import { Roadmap } from "@/components/sections/Roadmap";
import { TokenInfo } from "@/components/sections/TokenInfo";
import { Tokenomics } from "@/components/sections/Tokenomics";
import { WhyNibbo } from "@/components/sections/WhyNibbo";

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <ScrollProgress />
      <CustomCursor />
      <SpaceBackground />
      <MouseGlow />
      <Header />
      <main className="relative z-10 overflow-x-hidden">
        <Hero />
        <MeetNibbo />
        <WhyNibbo />
        <TokenInfo />
        <ContractAddress />
        <Tokenomics />
        <Roadmap />
        <Community />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
