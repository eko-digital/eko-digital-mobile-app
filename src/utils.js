// @flow
// eslint-disable-next-line import/prefer-default-export
export function getInitials(name: string) {
  const nameParts = name.split(' ');

  if (nameParts.length > 1) {
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];
    return `${firstName[0]}${lastName[0]}`;
  }

  return name.slice(0, 2).toUpperCase();
}
