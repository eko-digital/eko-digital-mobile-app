// @flow
import type { Account } from '../types';
import useSchool from '../hooks/useSchool';

type Props = {
  account: Account,
}

function SchoolName({ account }: Props) {
  const { school } = useSchool(account);

  return school ? school.name : '...';
}

export default SchoolName;
