import { sql } from "@vercel/postgres";
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

async function create(formData: FormData) {
	'use server';
	const doctor_id = formData.get('doctor_id') as string;
	const day_of_week = formData.get('day_of_week') as string;
	const start_time = formData.get('start_time') as string;
	const end_time = formData.get('end_time') as string;

	await sql`
    INSERT INTO appointment_schedule (doctor_id, day_of_week, start_time, end_time)
    VALUES (${doctor_id}, ${day_of_week}, ${start_time}, ${end_time})
  `.catch((error) => {
		console.error('Failed to create item')
	})

	revalidatePath('/appointment-schedule')
	redirect('/appointment-schedule')
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
    UPDATE appointment_schedule
    SET first_name = ${first_name}, last_name = ${last_name}, birth_date = ${birth_date}, gender = ${gender}, address = ${address}, phone = ${phone}
    WHERE id = ${id}
  `.catch((error) => {
		console.error('Failed')
	})

	revalidatePath(`/appointment-schedule/${id}`)
	revalidatePath('/appointment-schedule')
	redirect('/appointment-schedule')
}

const WEEKDAYS = ["Понедельник","Вторник","Среда","Четверг","Пятница","Суббота", "Воскресенье"]

export default async function Page({ params: { id } }: { params: { id: string } }) {
	let data = null
	const { rows: doctors } = await sql`SELECT id, first_name, last_name FROM doctors`

	if (id !== 'new') {
		const result = await sql`SELECT * FROM appointment_schedule WHERE id = ${id}`
		data = result.rows[0]
	}

	return (
			<form className="max-w-sm mx-auto" action={id === 'new' ? create : update}>
				<input type="hidden" name="id" value={data?.id} />
				<div className="mb-5">
					<label htmlFor="doctor_id" className="block mb-2 text-sm font-medium text-white-900">Врач</label>
					<select name="doctor_id" id="doctor_id" defaultValue={data?.doctor_id} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
						{doctors.map((item) => (
								<option key={item.id} value={item.id}>{item.first_name} {item.last_name}</option>
						))}
					</select>
				</div>
				<div className="mb-5">
					<label htmlFor="day_of_week" className="block mb-2 text-sm font-medium text-white-900">День недели</label>
					<select name="day_of_week" id="day_of_week" defaultValue={data?.day_of_week} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
						{WEEKDAYS.map((item) => (
								<option key={item} value={item}>{item}</option>
						))}
					</select>
				</div>
				<div className="mb-5">
					<label htmlFor="start_time" className="block mb-2 text-sm font-medium text-white-900">Время начала</label>
					<input type="time" name="start_time" id="start_time" defaultValue={data?.start_time} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
				</div>
				<div className="mb-5">
					<label htmlFor="end_time" className="block mb-2 text-sm font-medium text-white-900">Время окончания</label>
					<input type="time" name="end_time" id="end_time" defaultValue={data?.end_time} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
				</div>
				<button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-white-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit</button>
			</form>
	)
}
