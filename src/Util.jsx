const colors = ["#015411", "#019812", "#6bca24", "#ffb200", "#ff5d00", "#b20616", "#6f0214"];
export const grades = process.env.REACT_APP_GRADES.split(', ').map(
    (e, i) => ({label: e, color:colors[i]}));


