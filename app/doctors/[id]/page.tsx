import { sql } from "@vercel/postgres";
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

async function create(formData: FormData) {
	'use server';
	const first_name = formData.get('first_name') as string;
	const last_name = formData.get('last_name') as string;
	const office_number = formData.get('office_number') as string;
	const phone = formData.get('phone') as string;

	await sql`
    INSERT INTO doctors (first_name, last_name, office_number, phone)
    VALUES (${first_name}, ${last_name}, ${office_number}, ${phone})
  `.catch((error) => {
		console.error('Failed to create doctor')
	})

	revalidatePath('/doctors')
	redirect('/doctors')
}

async function update(formData: FormData) {
	'use server';
	const id = formData.get('id') as string;
	const first_name = formData.get('first_name') as string;
	const last_name = formData.get('last_name') as string;
	const office_number = formData.get('office_number') as string;
	const phone = formData.get('phone') as string;
	const specializations = formData.getAll('specializations').map((item) => parseInt(item.toString()))

	await sql`
		DELETE FROM doctors_specializations
		WHERE doctor_id = ${id}
		AND specialization_id <> ALL(${specializations});
	`.catch((error) => {
		console.error('Failed delete: ', error)
	})

	await sql`
		INSERT INTO doctors_specializations (doctor_id, specialization_id)
		SELECT ${id}, unnest(${specializations}::int[]);
	`.catch((error) => {
		console.error('Failed insert: ', error)
	})

	await sql`
    UPDATE doctors
    SET first_name = ${first_name}, last_name = ${last_name}, office_number = ${office_number}, phone = ${phone}
    WHERE id = ${id}
  `.catch((error) => {
		console.error('Failed')
	})

	revalidatePath(`/doctors/${id}`)
	revalidatePath('/doctors')
	redirect('/doctors')
}

export default async function Page({ params: { id } }: { params: { id: string } }) {
	let data = null

	const specializationsData = await sql`SELECT * FROM specializations`
	const { rows: specializations } = specializationsData

	const doctorsSpecializationsData = await sql`SELECT specialization_id FROM doctors_specializations WHERE doctor_id = ${id}`
	const doctorsSpecializations = doctorsSpecializationsData.rows.map((item) => item?.specialization_id)

	if (id !== 'new') {
		const result = await sql`SELECT * FROM doctors WHERE id = ${id}`
		data = result.rows[0]
	}

	return (
			<form className="max-w-sm mx-auto" action={id === 'new' ? create : update}>
				<input type="hidden" name="id" value={data?.id} />
				<div className="mb-5">
					<label htmlFor="first_name" className="block mb-2 text-sm font-medium text-white-900">Имя</label>
					<input type="text" name="first_name" id="first_name" defaultValue={data?.first_name} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
				</div>
				<div className="mb-5">
					<label htmlFor="last_name" className="block mb-2 text-sm font-medium text-white-900">Фамилия</label>
					<input type="text" name="last_name" id="last_name" defaultValue={data?.last_name} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
				</div>
				<div className="mb-5">
					<label htmlFor="office_number" className="block mb-2 text-sm font-medium text-white-900">Номер кабинета</label>
					<input type="text" name="office_number" id="office_number" defaultValue={data?.office_number} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
				</div>
				<div className="mb-5">
					<label htmlFor="phone" className="block mb-2 text-sm font-medium text-white-900">Телефон</label>
					<input type="text" name="phone" id="phone" defaultValue={data?.phone} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
				</div>
				<div className="mb-5">
					<label htmlFor="specializations" className="block mb-2 text-sm font-medium text-white-900">Спецализации</label>
					<select multiple name="specializations" id="specializations" size={10} defaultValue={doctorsSpecializations} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
						{specializations.map((item) => (
								<option key={item.id} value={item.id}>{item.name}</option>
						))}
					</select>
				</div>
				<button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-white-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit</button>
			</form>
	)
}
