import { MobileHeader } from "@/components/layout/mobile-header";
import { BottomNav } from "@/components/layout/bottom-nav";

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MobileHeader />
      <main className="mx-auto max-w-[480px] pb-16">{children}</main>
      <BottomNav />
    </>
  );
}
