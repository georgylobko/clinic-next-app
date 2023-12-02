import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import Link from "next/link";

export default async function Page() {
	const data = await sql`SELECT * FROM doctors`
	const { rows: doctors } = data

	return (
		<div className="relative overflow-x-auto">
			<Link href='/doctors/new'>
				<button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-white-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Добавить врача</button>
			</Link>

			<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
				<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
				<tr>
					<th scope="col" className="px-6 py-3">
						Имя
					</th>
					<th scope="col" className="px-6 py-3">
						Фамилия
					</th>
					<th scope="col" className="px-6 py-3">
						Номер кабинета
					</th>
					<th scope="col" className="px-6 py-3">
						Телефон
					</th>
				</tr>
				</thead>
				<tbody>
					{doctors.map((doctor) => (
						<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={doctor.id}>
							<th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
								{doctor.first_name}
							</th>
							<td className="px-6 py-4">
								{doctor.last_name}
							</td>
							<td className="px-6 py-4">
								{doctor.office_number}
							</td>
							<td className="px-6 py-4">
								{doctor.phone}
							</td>
						</tr>
					))}
				</tbody>
				</table>
			</div>
	)
}
