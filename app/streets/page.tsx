import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import Link from "next/link";

async function deleteItem(formData: FormData) {
	'use server';
	const id = formData.get('id') as string;

	await sql`
    DELETE FROM streets
    WHERE id = ${id}
  `.catch((error) => {
		console.error('Failed to delete streets')
	})

	revalidatePath('/streets')
}

export default async function Page() {
	const data = await sql`SELECT * FROM streets`
	const { rows: streets } = data

	return (
		<div className="relative overflow-x-auto">
			<h2 className="text-4xl font-extrabold mb-4">Улицы</h2>
			<Link href='/streets/new'>
				<button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-white-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Добавить</button>
			</Link>

			<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-4">
				<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
				<tr>
					<th scope="col" className="px-6 py-3">
						Название улицы
					</th>
					<th scope="col" className="px-6 py-3">
						Действия
					</th>
				</tr>
				</thead>
				<tbody>
					{streets.map((item) => (
						<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={item.id}>
							<th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
								{item?.name}
							</th>
							<td className="px-6 py-4 flex justify-left">
								<Link href={`/streets/${item.id}`}>
									<svg className="w-6 h-6 text-gray-800 dark:text-white mr-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
										<path d="M12.687 14.408a3.01 3.01 0 0 1-1.533.821l-3.566.713a3 3 0 0 1-3.53-3.53l.713-3.566a3.01 3.01 0 0 1 .821-1.533L10.905 2H2.167A2.169 2.169 0 0 0 0 4.167v11.666A2.169 2.169 0 0 0 2.167 18h11.666A2.169 2.169 0 0 0 16 15.833V11.1l-3.313 3.308Zm5.53-9.065.546-.546a2.518 2.518 0 0 0 0-3.56 2.576 2.576 0 0 0-3.559 0l-.547.547 3.56 3.56Z"/>
										<path d="M13.243 3.2 7.359 9.081a.5.5 0 0 0-.136.256L6.51 12.9a.5.5 0 0 0 .59.59l3.566-.713a.5.5 0 0 0 .255-.136L16.8 6.757 13.243 3.2Z"/>
									</svg>
								</Link>
								<form action={deleteItem}>
									<input type="hidden" name="id" value={item.id} />
									<button type="submit">
										<svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
											<path d="M17 4h-4V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2H1a1 1 0 0 0 0 2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2ZM7 2h4v2H7V2Zm1 14a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v8Zm4 0a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0v8Z"/>
										</svg>
									</button>
								</form>
							</td>
						</tr>
					))}
				</tbody>
				</table>
			</div>
	)
}
