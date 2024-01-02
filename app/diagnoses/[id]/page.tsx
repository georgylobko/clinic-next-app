import { sql } from "@vercel/postgres";
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { formatDate } from "@/lib/utils";

async function create(formData: FormData) {
	'use server';
	const diagnosis_name = formData.get('diagnosis_name') as string;
	const description = formData.get('description') as string;

	await sql`
    INSERT INTO diagnoses (diagnosis_name, description)
    VALUES (${diagnosis_name}, ${description})
  `.catch((error) => {
		console.error('Failed to create item')
	})

	revalidatePath('/diagnoses')
	redirect('/diagnoses')
}

async function update(formData: FormData) {
	'use server';
	const id = formData.get('id') as string;
	const diagnosis_name = formData.get('diagnosis_name') as string;
	const description = formData.get('description') as string;

	await sql`
    UPDATE diagnoses
    SET diagnosis_name = ${diagnosis_name}, description = ${description}
    WHERE id = ${id}
  `.catch((error) => {
		console.error('Failed')
	})

	revalidatePath(`/diagnoses/${id}`)
	revalidatePath('/diagnoses')
	redirect('/diagnoses')
}

export default async function Page({ params: { id } }: { params: { id: string } }) {
	let data = null

	if (id !== 'new') {
		const result = await sql`SELECT * FROM diagnoses WHERE id = ${id}`
		data = result.rows[0]
	}

	return (
			<form className="max-w-sm mx-auto" action={id === 'new' ? create : update}>
				<div className="mb-5">
					<label htmlFor="description" className="block mb-2 text-sm font-medium text-white-900">Название</label>
					<input type="text" name="diagnosis_name" id="diagnosis_name" defaultValue={data?.diagnosis_name}
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
