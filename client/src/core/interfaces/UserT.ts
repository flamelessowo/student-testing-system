export type User = {
  email: String | null,
  role: String | null,
  image: String | null,
  familyName?: String | null,
  givenName?: String | null,
  token: String | null,
}

export function getUnauthorizedUser(): User {
  return {email: null, givenName: null, familyName: null, image: null, token: null, role: null};
}