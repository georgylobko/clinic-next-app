import { sql } from "@vercel/postgres";
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

async function create(formData: FormData) {
	'use server';
	const first_name = formData.get('first_name') as string;
	const last_name = formData.get('last_name') as string;
	const office_number = formData.get('office_number') as string;
	const phone = formData.get('phone') as string;

	try {
		await sql`
    INSERT INTO doctors (first_name, last_name, office_number, phone)
    VALUES (${first_name}, ${last_name}, ${office_number}, ${phone})
  `

		revalidatePath('/doctors')
		redirect('/doctors')
		return { message: `Added a doctor` }
	} catch (e) {
		console.log(e)
		return { message: 'Failed to create doctor' }
	}
}

async function update(formData: FormData) {
	'use server';
	const first_name = formData.get('first_name') as string;
	const last_name = formData.get('last_name') as string;
	const office_number = formData.get('office_number') as string;
	const phone = formData.get('phone') as string;

	console.log('update');

	// try {
	// 	await sql`
  //   INSERT INTO doctors (first_name, last_name, office_number, phone)
  //   VALUES (${first_name}, ${last_name}, ${office_number}, ${phone})
  // `
	//
	// 	redirect('/doctors')
	// 	return { message: `Added a doctor` }
	// } catch (e) {
	// 	return { message: 'Failed to create doctor' }
	// }
}

export default async function Page({ params }: { params: { doctorId: string } }) {
	return (
			<form className="max-w-sm mx-auto" action={params.doctorId === 'new' ? create : update}>
				<div className="mb-5">
					<label htmlFor="first_name" className="block mb-2 text-sm font-medium text-white-900">Имя</label>
					<input type="text" name="first_name" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
				</div>
				<div className="mb-5">
					<label htmlFor="last_name" className="block mb-2 text-sm font-medium text-white-900">Фамилия</label>
					<input type="text" name="last_name" id="last_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
				</div>
				<div className="mb-5">
					<label htmlFor="office_number" className="block mb-2 text-sm font-medium text-white-900">Номер кабинета</label>
					<input type="text" name="office_number" id="office_number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
				</div>
				<div className="mb-5">
					<label htmlFor="phone" className="block mb-2 text-sm font-medium text-white-900">Телефон</label>
					<input type="text" name="phone" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
				</div>
				<button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-white-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit</button>
			</form>
	)
}
