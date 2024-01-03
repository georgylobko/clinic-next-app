import { sql } from "@vercel/postgres";
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic';

async function create(formData: FormData) {
	'use server';
	const name = formData.get('name') as string;
	const description = formData.get('description') as string;
	const preparation = formData.get('preparation') as string;

	await sql`
    INSERT INTO medical_treatments (name, description, preparation)
    VALUES (${name}, ${description}, ${preparation})
  `.catch((error) => {
		console.error('Failed to create item')
	})

	revalidatePath('/medical-treatments')
	redirect('/medical-treatments')
}

async function update(formData: FormData) {
	'use server';
	const id = formData.get('id') as string;
	const name = formData.get('name') as string;
	const description = formData.get('description') as string;
	const preparation = formData.get('preparation') as string;

	await sql`
    UPDATE medical_treatments
    SET name = ${name}, description = ${description}, preparation = ${preparation}
    WHERE id = ${id}
  `.catch((error) => {
		console.error('Failed')
	})

	revalidatePath(`/medical-treatments/${id}`)
	revalidatePath('/medical-treatments')
	redirect('/medical-treatments')
}

export default async function Page({ params: { id } }: { params: { id: string } }) {
	let data = null

	if (id !== 'new') {
		const result = await sql`SELECT * FROM medical_treatments WHERE id = ${id}`
		data = result.rows[0]
	}

	return (
			<form className="max-w-sm mx-auto" action={id === 'new' ? create : update}>
				<input type="hidden" name="id" value={data?.id}/>
				<div className="mb-5">
					<label htmlFor="name" className="block mb-2 text-sm font-medium text-white-900">Название</label>
					<input type="text" name="name" id="name" defaultValue={data?.name}
					       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
					       required/>
				</div>
				<div className="mb-5">
					<label htmlFor="description" className="block mb-2 text-sm font-medium text-white-900">Описание</label>
					<input type="text" name="description" id="description" defaultValue={data?.description}
					       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
					       required/>
				</div>
				<div className="mb-5">
					<label htmlFor="preparation" className="block mb-2 text-sm font-medium text-white-900">Подготовка</label>
					<input type="text" name="preparation" id="preparation" defaultValue={data?.preparation}
					       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
					       required/>
				</div>
				<button type="submit"
				        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-white-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit
				</button>
			</form>
	)
}
