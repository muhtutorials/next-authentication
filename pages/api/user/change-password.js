import { connectDB } from '../../../fns/db';
import { getSession } from 'next-auth/client';
import { verifyPassword, hashPassword } from '../../../fns/auth';

export default async function handler(req, res) {
    if (req.method !== 'PATCH') {
        return;
    }

    const session = await getSession({ req });

    if (!session) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }

    const email = session.user.email;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    const client = await connectDB();

    const userCollection = await client.db().collection('users');

    const user = await userCollection.findOne({ email });        

    if (!user) {
        res.status(404).json({ message: 'User not found' });
        client.close();
        return;
    }

    const currentPassword = user.password;

    const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword);

    if (!passwordsAreEqual) {
        res.status(403).json({ message: 'Invalid password' });
        client.close();
        return;        
    }

    const hashedPassword = await hashPassword(newPassword);

    const result = await userCollection.updateOne(
        { email },
        { $set: { password: hashedPassword } }
    );

    res.status(200).json({ message: 'Password updated' });

    client.close();
}

export async function getServerSideProps(context) {
    const session = await getSession({ req: context.req });

    if (!session) {
        return {
            redirect: {
                destination: '/auth',
                permanent: false
            }
        }
    }

    return {
        props: { session }
    }
}