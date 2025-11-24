import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth.ts";

const MyPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const response = await getMyInfo();
      console.log(response);

      setData(response.data);
    };

    getData();
  }, []);

  return (
    <div>
      {data.name} {data.email}
    </div>
  );
};

export default MyPage;
