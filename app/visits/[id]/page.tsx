import { sql } from "@vercel/postgres";
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import {formatDate} from "@/lib/utils";

async function create(formData: FormData) {
	'use server';
	const patient_id = formData.get('patient_id') as string;
	const doctor_id = formData.get('doctor_id') as string;
	const visit_date = formData.get('visit_date') as string;
	const prescription = formData.get('prescription') as string;

	await sql`
    INSERT INTO visits (patient_id, doctor_id, visit_date, prescription)
    VALUES (${patient_id}, ${doctor_id}, ${visit_date}, ${prescription})
  `.catch((error) => {
		console.error('Failed to create item')
	})

	revalidatePath('/visits')
	redirect('/visits')
}

async function update(formData: FormData) {
	'use server';
	const id = formData.get('id') as string;
	const patient_id = formData.get('patient_id') as string;
	const doctor_id = formData.get('doctor_id') as string;
	const visit_date = formData.get('visit_date') as string;
	const prescription = formData.get('prescription') as string;

	await sql`
    UPDATE visits
    SET patient_id = ${patient_id}, doctor_id = ${doctor_id}, visit_date = ${visit_date}, prescription = ${prescription}
    WHERE id = ${id}
  `.catch((error) => {
		console.error('Failed')
	})

	revalidatePath(`/visits/${id}`)
	revalidatePath('/visits')
	redirect('/visits')
}

export default async function Page({ params: { id } }: { params: { id: string } }) {
	let data = null
	const { rows: doctors } = await sql`SELECT id, first_name, last_name FROM doctors`
	const { rows: patients } = await sql`SELECT id, first_name, last_name FROM patients`

	if (id !== 'new') {
		const result = await sql`SELECT * FROM visits WHERE id = ${id}`
		data = result.rows[0]
	}

	return (
			<form className="max-w-sm mx-auto" action={id === 'new' ? create : update}>
				<input type="hidden" name="id" value={data?.id} />
				<div className="mb-5">
					<label htmlFor="patient_id" className="block mb-2 text-sm font-medium text-white-900">Пациент</label>
					<select name="patient_id" id="patient_id" defaultValue={data?.patient_id} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
						{patients.map((item) => (
								<option key={item.id} value={item.id}>{item.first_name} {item.last_name}</option>
						))}
					</select>
				</div>
				<div className="mb-5">
					<label htmlFor="doctor_id" className="block mb-2 text-sm font-medium text-white-900">Врач</label>
					<select name="doctor_id" id="doctor_id" defaultValue={data?.doctor_id} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
						{doctors.map((item) => (
								<option key={item.id} value={item.id}>{item.first_name} {item.last_name}</option>
						))}
					</select>
				</div>
				<div className="mb-5">
					<label htmlFor="visit_date" className="block mb-2 text-sm font-medium text-white-900">День визита</label>
					<input type="date" name="visit_date" id="visit_date" defaultValue={formatDate(data?.visit_date)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
				</div>
				<div className="mb-5">
					<label htmlFor="prescription" className="block mb-2 text-sm font-medium text-white-900">Рекомендации</label>
					<input type="text" name="prescription" id="prescription" defaultValue={data?.prescription} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
				</div>
				<button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-white-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit</button>
			</form>
	)
}
