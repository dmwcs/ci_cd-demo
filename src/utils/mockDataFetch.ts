// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockFetchData = async (url: string, data?: any) => {
  if (url === '/login') {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (data?.username !== 'admin' || data?.password !== '888888') {
      throw new Error('Invalid username or password');
    }

    return {
      token: 'mocked-token-admin',
      user: data.username,
    };
  }

  return null;
};

export default mockFetchData;
