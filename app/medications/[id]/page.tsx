import { sql } from "@vercel/postgres";
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic';

async function create(formData: FormData) {
	'use server';
	const medication_name = formData.get('medication_name') as string
	const form = formData.get('form') as string
	const manufacturer = formData.get('manufacturer') as string
	const description = formData.get('description') as string

	await sql`
    INSERT INTO medications (medication_name, form, manufacturer, description)
    VALUES (${medication_name}, ${form}, ${manufacturer}, ${description})
  `.catch((error) => {
		console.error('Failed to create item')
	})

	revalidatePath('/medications')
	redirect('/medications')
}

async function update(formData: FormData) {
	'use server';
	const id = formData.get('id') as string;
	const medication_name = formData.get('medication_name') as string
	const form = formData.get('form') as string
	const manufacturer = formData.get('manufacturer') as string
	const description = formData.get('description') as string

	await sql`
    UPDATE medications
    SET medication_name = ${medication_name}, form = ${form}, manufacturer = ${manufacturer}, description = ${description}
    WHERE id = ${id}
  `.catch((error) => {
		console.error('Failed')
	})

	revalidatePath(`/medications/${id}`)
	revalidatePath('/medications')
	redirect('/medications')
}

export default async function Page({ params: { id } }: { params: { id: string } }) {
	let data = null

	if (id !== 'new') {
		const result = await sql`SELECT * FROM medications WHERE id = ${id}`
		data = result.rows[0]
	}

	return (
			<form className="max-w-sm mx-auto" action={id === 'new' ? create : update}>
				<input type="hidden" name="id" value={data?.id}/>
				<div className="mb-5">
					<label htmlFor="medication_name" className="block mb-2 text-sm font-medium text-white-900">Название</label>
					<input type="text" name="medication_name" id="medication_name" defaultValue={data?.medication_name}
					       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
					       required/>
				</div>
				<div className="mb-5">
					<label htmlFor="form" className="block mb-2 text-sm font-medium text-white-900">Форма</label>
					<input type="text" name="form" id="form" defaultValue={data?.form}
					       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
					       required/>
				</div>
				<div className="mb-5">
					<label htmlFor="manufacturer" className="block mb-2 text-sm font-medium text-white-900">Производитель</label>
					<input type="text" name="manufacturer" id="manufacturer" defaultValue={data?.manufacturer}
					       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
					       required/>
				</div>
				<div className="mb-5">
					<label htmlFor="description" className="block mb-2 text-sm font-medium text-white-900">Описание</label>
					<input type="text" name="description" id="description" defaultValue={data?.description}
					       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
					       required/>
				</div>
				<button type="submit"
				        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-white-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit
				</button>
			</form>
	)
}
