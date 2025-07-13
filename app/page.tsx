import BannerCreator from "@/features/BannerCreator";

export default function Home() {
  return (
    <main className="flex flex-col justify-between p-6 gap-2 max-w-[768px] w-full">
      <BannerCreator />
    </main>
  );
}
