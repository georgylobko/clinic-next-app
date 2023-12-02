import { Suspense } from 'react'
import Table from '@/components/table'
import TablePlaceholder from '@/components/table-placeholder'
import { seed } from "@/lib/seed";

export default async function Home() {
  await seed()
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      main page
      {/*<Suspense fallback={<TablePlaceholder />}>*/}
      {/*  <Table />*/}
      {/*</Suspense>*/}
    </main>
  )
}
