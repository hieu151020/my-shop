import { useEffect, useState } from "react";
import { db } from "../firebase.config";
import { collection, getDocs, limit, onSnapshot, orderBy, query, startAfter } from "firebase/firestore";

const useGetDataFilter = (collectionName,orderByField,limitNumber,currentPage) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const collectionRef = collection(db, collectionName);

  useEffect(() => {
    const queryData = query(
        collectionRef,
        orderBy(orderByField),
        limit(limitNumber),
        startAfter((currentPage - 1) * limitNumber),
      );
  
      console.log(queryData);
  
      const getData = onSnapshot(queryData, (snapshot) => {
        const newData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        setData(newData);
        setLoading(false);
      });

      return () => getData();
  }, [collectionRef, currentPage, limitNumber, orderByField]);

  return { data, loading };
};

export default useGetDataFilter;
