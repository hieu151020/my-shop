import moment from "moment/moment";

const useSortData = (data,field) => {
    let dataSort = []
    dataSort = data.sort((a,b) => {
      const dateA = moment(a[field], "DD/MM/YY").toDate();
    const dateB = moment(b[field], "DD/MM/YY").toDate();
      return dateB - dateA;
    });
    return dataSort
}

export default useSortData;
