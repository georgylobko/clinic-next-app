import { sql } from '@vercel/postgres'

export async function seed() {
  const createTables = await Promise.all([
    sql`
     CREATE TABLE IF NOT EXISTS specializations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    );`,
    sql`CREATE TABLE IF NOT EXISTS patients (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      birth_date DATE NOT NULL,
      gender VARCHAR(10) NOT NULL,
      address VARCHAR(255),
      phone VARCHAR(20),
      country_id INTEGER REFERENCES countries(id),
      city_id INTEGER REFERENCES cities(id),
      street_id INTEGER REFERENCES streets(id),
      postcode INTEGER,
      house_number INTEGER,
      apartment_number INTEGER
    );`,
    sql`CREATE TABLE IF NOT EXISTS doctors (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      office_number INTEGER,
      phone VARCHAR(20)
    );`,
    sql`CREATE TABLE IF NOT EXISTS doctors_specializations (
      doctor_id INTEGER REFERENCES doctors(id),
      specialization_id INTEGER REFERENCES specializations(id),
      PRIMARY KEY (doctor_id, specialization_id)
    );`,
    sql`CREATE TABLE IF NOT EXISTS appointment_schedule (
      id SERIAL PRIMARY KEY,
      doctor_id INTEGER REFERENCES doctors(id),
      day_of_week VARCHAR(15) NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL
    );`,
    sql`CREATE TABLE IF NOT EXISTS visits (
      id SERIAL PRIMARY KEY,
      patient_id INTEGER REFERENCES patients(id),
      doctor_id INTEGER REFERENCES doctors(id),
      schedule_id INTEGER REFERENCES appointment_schedule(id),
      visit_date DATE NOT NULL,
      prescription TEXT
    );`,
    sql`CREATE TABLE IF NOT EXISTS diagnoses (
      id SERIAL PRIMARY KEY,
      diagnosis_name VARCHAR(255) NOT NULL,
      description TEXT
    );`,
    sql`CREATE TABLE IF NOT EXISTS visit_diagnoses (
      visit_id INTEGER REFERENCES visits(id),
      diagnosis_id INTEGER REFERENCES diagnoses(id),
      PRIMARY KEY (visit_id, diagnosis_id)
    );`,
    sql`CREATE TABLE IF NOT EXISTS medical_treatments (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      preparation TEXT
    );`,
    sql`CREATE TABLE IF NOT EXISTS diagnoses_medical_treatments (
      diagnosis_id INTEGER REFERENCES diagnoses(id),
      medical_treatment_id INTEGER REFERENCES medical_treatments(id),
      PRIMARY KEY (diagnosis_id, medical_treatment_id)
    );`,
    sql`CREATE TABLE IF NOT EXISTS medications (
      id SERIAL PRIMARY KEY,
      medication_name VARCHAR(255) NOT NULL,
      form VARCHAR(50) NOT NULL,
      manufacturer VARCHAR(255) NOT NULL,
      description VARCHAR(255) NOT NULL
    );`,
    sql`CREATE TABLE IF NOT EXISTS countries (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );`,
    sql`CREATE TABLE IF NOT EXISTS cities (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );`,
    sql`CREATE TABLE IF NOT EXISTS streets (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );`
  ]);

  return createTables
}
