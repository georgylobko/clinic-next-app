import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import Link from "next/link";

import { formatDate } from "@/lib/utils";

async function deleteItem(formData: FormData) {
	'use server';
	const id = formData.get('id') as string;

	await sql`
    DELETE FROM visits
    WHERE id = ${id}
  `.catch((error) => {
		console.error('Failed to delete doctor: ', error)
	})

	revalidatePath('/visits')
}

async function getItems(params: { doctor_id?: string; patient_id?: string }) {
	const { doctor_id, patient_id } = params

	if (!doctor_id && !patient_id) {
		return sql`
			SELECT
		    visits.*,
		    doctors.first_name as doctor_first_name,
		    doctors.last_name as doctor_last_name,
		    patients.first_name as patient_first_name,
		    patients.last_name as patient_last_name
			FROM
		    visits
		  LEFT JOIN 
        doctors ON visits.doctor_id = doctors.id
      LEFT JOIN 
      	patients ON visits.patient_id = patients.id;
	`
	}

	if (doctor_id && patient_id) {
		return sql`
			SELECT
			    v.*,
			    doctors.first_name as doctor_first_name,
			    doctors.last_name as doctor_last_name,
			    patients.first_name as patient_first_name,
			    patients.last_name as patient_last_name
			FROM
			    visits v
			LEFT JOIN
			    doctors ON v.doctor_id = doctors.id
			LEFT JOIN
			    patients ON v.patient_id = patients.id
			WHERE
			    v.doctor_id = ${doctor_id} AND v.patient_id = ${patient_id};
	`
	}

	if (doctor_id) {
		return sql`
			SELECT
			    v.*,
			    doctors.first_name as doctor_first_name,
			    doctors.last_name as doctor_last_name,
			    patients.first_name as patient_first_name,
			    patients.last_name as patient_last_name
			FROM
			    visits v
			LEFT JOIN
			    doctors ON v.doctor_id = doctors.id
			LEFT JOIN
			    patients ON v.patient_id = patients.id
			WHERE
			    v.doctor_id = ${doctor_id};
	`
	}

	return sql`
		SELECT
	    v.*,
	    doctors.first_name as doctor_first_name,
	    doctors.last_name as doctor_last_name,
	    patients.first_name as patient_first_name,
	    patients.last_name as patient_last_name
		FROM
	    visits v
		LEFT JOIN
	    doctors ON v.doctor_id = doctors.id
		LEFT JOIN
	    patients ON v.patient_id = patients.id
		WHERE
	    v.patient_id = ${patient_id};
	`
}

export default async function Page(props: { searchParams: { doctor_id?: string; patient_id?: string } }) {
	const { patient_id, doctor_id } = props.searchParams
	const data = await getItems(props.searchParams)
	const { rows: doctors } = await sql`SELECT id, first_name, last_name FROM doctors`
	const { rows: patients } = await sql`SELECT id, first_name, last_name FROM patients`
	const { rows: visits } = data

	return (
		<div className="relative overflow-x-auto">
			<h2 className="text-4xl font-extrabold mb-4">Визиты</h2>

			<Link href='/visits/new'>
				<button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-white-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Добавить</button>
			</Link>

			<div className="mt-2 mb-2 max-w-screen-md">
				<form className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
					<h2 className="text-stone-700 text-xl font-bold">Фильтры</h2>
					<div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						<div className="flex flex-col">
							<label htmlFor="patient_id" className="block mb-2 text-sm font-medium text-white-900">Пациент</label>
							<select name="patient_id" id="patient_id" defaultValue={patient_id}
							        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
								<option key={0} selected></option>
								{patients.map((item) => (
										<option key={item.id} value={item.id}>{item.first_name} {item.last_name}</option>
								))}
							</select>
						</div>
						<div className="flex flex-col">
							<label htmlFor="doctor_id" className="block mb-2 text-sm font-medium text-white-900">Врач</label>
							<select name="doctor_id" id="doctor_id" defaultValue={doctor_id}
							        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
								<option key={0} selected></option>
								{doctors.map((item) => (
										<option key={item.id} value={item.id}>{item.first_name} {item.last_name}</option>
								))}
							</select>
						</div>
					</div>

					<div className="mt-6 grid w-full grid-cols-2 justify-end space-x-4 md:flex">
						<button
								className="active:scale-95 rounded-lg bg-blue-600 px-8 py-2 font-medium text-white outline-none focus:ring hover:opacity-90" type="submit">Применить</button>
					</div>
				</form>
			</div>

			<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-4">
				<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
				<tr>
					<th scope="col" className="px-6 py-3">
						Врач
					</th>
					<th scope="col" className="px-6 py-3">
						Пациент
					</th>
					<th scope="col" className="px-6 py-3">
						Дата визита
					</th>
					<th scope="col" className="px-6 py-3">
						Рекомендации
					</th>
				</tr>
				</thead>
				<tbody>
				{visits.map((item) => (
						<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={item.id}>
							<th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
								{item.doctor_first_name} {item.doctor_last_name}
							</th>
							<td className="px-6 py-4">
								{item.patient_first_name} {item.patient_last_name}
							</td>
							<td className="px-6 py-4">
								{formatDate(item.visit_date)}
							</td>
							<td className="px-6 py-4 flex justify-left">
								<Link href={`/visits/${item.id}`}>
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
