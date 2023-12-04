import { sql } from "@vercel/postgres";
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

async function create(formData: FormData) {
	'use server';
	const first_name = formData.get('first_name') as string;
	const last_name = formData.get('last_name') as string;
	const birth_date = formData.get('birth_date') as string;
	const gender = formData.get('gender') as string;
	const address = formData.get('address') as string;
	const phone = formData.get('phone') as string;

	await sql`
    INSERT INTO patients (first_name, last_name, birth_date, gender, address, phone)
    VALUES (${first_name}, ${last_name}, ${birth_date}, ${gender}, ${address}, ${phone})
  `.catch((error) => {
		console.error('Failed to create patient')
	})

	revalidatePath('/patients')
	redirect('/patients')
}

const formatDate = (date?: Date) => {
	if (!date) return ''

	return date?.toISOString().split('T')[0]
}

async function update(formData: FormData) {
	'use server';
	const id = formData.get('id') as string;
	const first_name = formData.get('first_name') as string;
	const last_name = formData.get('last_name') as string;
	const birth_date = formData.get('birth_date') as string;
	const gender = formData.get('gender') as string;
	const address = formData.get('address') as string;
	const phone = formData.get('phone') as string;

	await sql`
    UPDATE patients
    SET first_name = ${first_name}, last_name = ${last_name}, birth_date = ${birth_date}, gender = ${gender}, address = ${address}, phone = ${phone}
    WHERE id = ${id}
  `.catch((error) => {
		console.error('Failed')
	})

	revalidatePath(`/patients/${id}`)
	revalidatePath('/patients')
	redirect('/patients')
}

export default async function Page({ params: { id } }: { params: { id: string } }) {
	let data = null

	if (id !== 'new') {
		const result = await sql`SELECT * FROM patients WHERE id = ${id}`
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
					<label htmlFor="birth_date" className="block mb-2 text-sm font-medium text-white-900">Дата рождения</label>
					<input type="date" name="birth_date" id="birth_date" defaultValue={formatDate(data?.birth_date)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
				</div>
				<div className="mb-5">
					<label htmlFor="gender" className="block mb-2 text-sm font-medium text-white-900">Пол</label>
					<input type="text" name="gender" id="gender" defaultValue={data?.gender} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
				</div>
				<div className="mb-5">
					<label htmlFor="address" className="block mb-2 text-sm font-medium text-white-900">Адрес</label>
					<input type="text" name="address" id="address" defaultValue={data?.address} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
				</div>
				<div className="mb-5">
					<label htmlFor="phone" className="block mb-2 text-sm font-medium text-white-900">Телефон</label>
					<input type="text" name="phone" id="phone" defaultValue={data?.phone} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
				</div>
				<button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-white-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit</button>
			</form>
	)
}
