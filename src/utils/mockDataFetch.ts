// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockFetchData = async (url: string, data?: any) => {
  if (url === '/login') {
    return {
      token: 'mocked-token',
      user: { username: data.username },
    };
  }

  if (url === '/getUserList') {
    return [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];
  }

  return null;
};

export default mockFetchData;
