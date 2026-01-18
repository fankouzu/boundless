import { Metadata } from 'next';
import { AuthGuard } from '@/components/auth';

export const metadata: Metadata = {
  title: 'My Profile | Boundless',
  description: 'View and manage your profile on Boundless',
};

export default async function MePage() {
  return (
    <AuthGuard
      redirectTo='/auth?mode=signin'
      fallback={<div className='p-8 text-center'>Authenticating...</div>}
    >
      <section className=''></section>
    </AuthGuard>
  );
}
