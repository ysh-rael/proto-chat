import { headers } from 'next/headers';
import ChatLayout from '@/components/ChatLayout';

export default async function Page() {
  const headersList = headers();
  const host = headersList.get('host'); // Ex: localhost:3000 ou IP
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const res = await fetch(`${protocol}://${host}/api`, {
    cache: 'no-store',
  });

  const data = await res.json();

  console.log('/api')
console.log(JSON.stringify(data, null, 2))
  return ( <ChatLayout /> );
}
