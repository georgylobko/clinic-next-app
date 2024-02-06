import { sql } from "@vercel/postgres";
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { formatDate } from "@/lib/utils";

async function create(formData: FormData) {
	'use server';
	const first_name = formData.get('first_name') as string;
	const last_name = formData.get('last_name') as string;
	const birth_date = formData.get('birth_date') as string;
	const gender = formData.get('gender') as string;
	const address = formData.get('address') as string;
	const phone = formData.get('phone') as string;
	const country_id = formData.get('country_id') as string;
	const city_id = formData.get('city_id') as string;
	const street_id = formData.get('street_id') as string;
	const postcode = formData.get('postcode') as string;
	const house_number = formData.get('house_number') as string;
	const apartment_number = formData.get('apartment_number') as string;

	await sql`
    INSERT INTO patients (first_name, last_name, birth_date, gender, address, phone, country_id, city_id, street_id, postcode, house_number, apartment_number)
    VALUES (${first_name}, ${last_name}, ${birth_date}, ${gender}, ${address}, ${phone}, ${country_id}, ${city_id}, ${street_id}, ${postcode}, ${house_number}, ${apartment_number})
  `.catch((error) => {
		console.error('Failed to create patient')
	})

	revalidatePath('/patients')
	redirect('/patients')
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
	const country_id = formData.get('country_id') as string;
	const city_id = formData.get('city_id') as string;
	const street_id = formData.get('street_id') as string;
	const postcode = formData.get('postcode') as string;
	const house_number = formData.get('house_number') as string;
	const apartment_number = formData.get('apartment_number') as string;

	await sql`
    UPDATE patients
    SET first_name = ${first_name}, last_name = ${last_name}, birth_date = ${birth_date}, gender = ${gender}, address = ${address}, phone = ${phone} country_id = ${country_id} city_id = ${city_id} street_id = ${street_id} postcode = ${postcode} house_number = ${house_number} apartment_number = ${apartment_number}
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
	const { rows: countries } = await sql`SELECT * FROM countries`
	const { rows: cities } = await sql`SELECT * FROM cities`
	const { rows: streets } = await sql`SELECT * FROM streets`

	if (id !== 'new') {
		const result = await sql`SELECT * FROM patients WHERE id = ${id}`
		data = result.rows[0]
	}

	return (
			<form className="max-w-sm mx-auto" action={id === 'new' ? create : update}>
				<input type="hidden" name="id" value={data?.id}/>
				<div className="mb-5">
					<label htmlFor="first_name" className="block mb-2 text-sm font-medium text-white-900">Имя</label>
					<input type="text" name="first_name" id="first_name" defaultValue={data?.first_name}
					       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
					       required/>
				</div>
				<div className="mb-5">
					<label htmlFor="last_name" className="block mb-2 text-sm font-medium text-white-900">Фамилия</label>
					<input type="text" name="last_name" id="last_name" defaultValue={data?.last_name}
					       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
					       required/>
				</div>
				<div className="mb-5">
					<label htmlFor="birth_date" className="block mb-2 text-sm font-medium text-white-900">Дата рождения</label>
					<input type="date" name="birth_date" id="birth_date" defaultValue={formatDate(data?.birth_date)}
					       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
					       required/>
				</div>
				<div className="mb-5">
					<label htmlFor="gender" className="block mb-2 text-sm font-medium text-white-900">Пол</label>
					<input type="text" name="gender" id="gender" defaultValue={data?.gender}
					       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
					       required/>
				</div>
				<div className="mb-5">
					<label htmlFor="address" className="block mb-2 text-sm font-medium text-white-900">Адрес</label>
					<input type="text" name="address" id="address" defaultValue={data?.address}
					       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
					       />
				</div>
				<div className="mb-5">
					<label htmlFor="phone" className="block mb-2 text-sm font-medium text-white-900">Телефон</label>
					<input type="text" name="phone" id="phone" defaultValue={data?.phone}
					       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
					       required/>
				</div>
				<div className="mb-5">
					<label htmlFor="country_id" className="block mb-2 text-sm font-medium text-white-900">Страна</label>
					<select name="country_id" id="country_id" defaultValue={data?.country_id}
					        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
					        required>
						{countries.map((item) => (
								<option key={item.id} value={item.id}>{item.name}</option>
						))}
					</select>
				</div>
				<div className="mb-5">
					<label htmlFor="city_id" className="block mb-2 text-sm font-medium text-white-900">Город</label>
					<select name="city_id" id="city_id" defaultValue={data?.city_id}
					        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
					        required>
						{cities.map((item) => (
								<option key={item.id} value={item.id}>{item.name}</option>
						))}
					</select>
				</div>
				<div className="mb-5">
					<label htmlFor="street_id" className="block mb-2 text-sm font-medium text-white-900">Улица</label>
					<select name="street_id" id="street_id" defaultValue={data?.street_id}
					        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
					        required>
						{streets.map((item) => (
								<option key={item.id} value={item.id}>{item.name}</option>
						))}
					</select>
				</div>
				<div className="mb-5">
					<label htmlFor="postcode" className="block mb-2 text-sm font-medium text-white-900">Почтовый индекс</label>
					<input type="text" name="postcode" id="postcode" defaultValue={data?.postcode}
					       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
					       required/>
				</div>
				<div className="mb-5">
					<label htmlFor="house_number" className="block mb-2 text-sm font-medium text-white-900">Номер дома</label>
					<input type="text" name="house_number" id="house_number" defaultValue={data?.house_number}
					       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
					       required/>
				</div>
				<div className="mb-5">
					<label htmlFor="apartment_number" className="block mb-2 text-sm font-medium text-white-900">Номер квартиры</label>
					<input type="text" name="apartment_number" id="apartment_number" defaultValue={data?.apartment_number}
					       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
					       required/>
				</div>
				<button type="submit"
				        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-white-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit
				</button>
			</form>
	)
}
