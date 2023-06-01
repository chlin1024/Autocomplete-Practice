const getDataFromAPI = async (page) => {
  const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    },
  };
  const data = fetch(url, options).then((res) => res.json());
  return data;
};

export default getDataFromAPI;
