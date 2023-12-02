import { seed } from "@/lib/seed";

export default async function Home() {
  await seed()
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      main page
    </main>
  )
}
