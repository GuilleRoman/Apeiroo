import pool from './repository';

export async function getDuties() {
    return (await pool.query('SELECT * FROM duties')).rows;
}

export async function addDuty(name: string) {
    return (await pool.query('INSERT INTO duties (name) VALUES ($1) RETURNING *', [name])).rows[0];
}