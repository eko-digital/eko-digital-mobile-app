// @flow
import type { Account } from '../types';
import useInstitute from '../hooks/useInstitute';

type Props = {
  account: Account,
}

function InstituteName({ account }: Props) {
  const { institute } = useInstitute(account);

  return institute ? institute.name : '...';
}

export default InstituteName;
