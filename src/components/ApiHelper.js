const BASE_NONAPI = `http://192.168.100.175:8000`; //kontrakan ages
// const BASE_NONAPI = `http://192.168.1.89:8000`; //svragakopi
// const BASE_NONAPI = `http://192.168.92.246:8000`; //kampus
// const BASE_NONAPI = `http://10.113.79.121:8000`; //kampus

const BASE_THIS = `https://gofit_ages.netlify.app`;
const BASE_URL = BASE_NONAPI + "/api";

function getHTMLTimestamp(timestamp) {
  let date = new Date(timestamp);

  // difference between time and now
  let now = new Date();
  let diff = now - date;
  let diffDays = Math.floor(diff / 86400000); // days
  let diffHrs = Math.floor((diff % 86400000) / 3600000); // hours
  let diffMins = Math.round(((diff % 86400000) % 3600000) / 60000); // minutes
  if (diffDays > 0) {
    return diffDays + " hari yang lalu";
  } else if (diffHrs > 0) {
    return diffHrs + " jam yang lalu";
  } else {
    return diffMins + " menit yang lalu";
  }
}

function getDateTimeID(timestamp, format) {
  let date = new Date(timestamp);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  let result = "";

  const BULAN = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  switch (format) {
    case "month":
      result = BULAN[month - 1] + " " + year;
      break;
    case "fulldate":
      result = day + " " + BULAN[month - 1] + " " + year;
      break;
    case "fulldatetime":
      result =
        day +
        " " +
        BULAN[month - 1] +
        " " +
        year +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second;
      break;
  }
  return result;
}

export { BASE_THIS, BASE_URL, BASE_NONAPI, getHTMLTimestamp, getDateTimeID };
