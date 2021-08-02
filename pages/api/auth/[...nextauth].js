import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { connectDB } from '../../../fns/db';
import { verifyPassword } from '../../../fns/auth';

export default NextAuth({
    session: {
      jwt: true  // default value. No need to specify
    },
    providers: [
        Providers.Credentials({
            async authorize(credentials) {
                const client = await connectDB();

                const usersCollection = client.db().collection('users');

                const user = await usersCollection.findOne({ email: credentials.email });

                if (!user) {
                    client.close();
                    throw new Error('No user found');
                }

                const isValid = await verifyPassword(credentials.password, user.password);

                if (!isValid) {
                    client.close();
                    throw new Error('Could not log you in');
                }

                client.close();

                return { email: user.email }
            }
        })
    ]
});