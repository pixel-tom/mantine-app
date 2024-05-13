import { useRouter } from 'next/router';
import React from 'react';
import AccountDetails from '@/components/AccountDetails';

const AccountDetailsPage = () => {
  const router = useRouter();
  const { publicKey } = router.query;

  return (
    <>
      <AccountDetails publicKey={publicKey as string} />
    </>
  );
};

export default AccountDetailsPage;
