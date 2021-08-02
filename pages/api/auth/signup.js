import { connectDB } from '../../../fns/db';
import { hashPassword } from '../../../fns/auth';

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return;
	}

	const { email, password } = req.body;

	if (!email || !email.includes('@') || !password || password.trim().length < 7) {
		res.status(422).json({ message: 'Invalid input' });

		return;
	}

	const client = await connectDB();
	const db = client.db();

	const emailExists = await db.collection('users').findOne({ email });

	if (emailExists) {
		res.status(422).json({ message: 'User already exists' });
		client.close();
		return;		
	};

	const hashedPassword = await hashPassword(password);

	const result = await db.collection('users').insertOne({ email, password: hashedPassword });

	res.status(201).json({ message: 'User created successfully!' });
	client.close();
}