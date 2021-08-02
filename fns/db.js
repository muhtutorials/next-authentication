import { MongoClient } from 'mongodb';

export async function connectDB() {
	const client = await MongoClient.connect('mongodb+srv://igor:spellbound@cluster0.vtkas.mongodb.net/auth?retryWrites=true&w=majority');
	
	return client;
}