import { Provider } from 'next-auth/client';
import Layout from '../components/layout/layout';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
    return (
        // skips session loading by useSession hook in navigation component on profile page
        // because session is loaded using getServerSideProps function
        <Provider session={pageProps.session}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </Provider>
    );
}