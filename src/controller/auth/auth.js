
export function storeToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

export function getToken() {
  const token = JSON.parse(sessionStorage.getItem('token'))
  return token
}

export function clearToken() {
  sessionStorage.removeItem('token');
}
