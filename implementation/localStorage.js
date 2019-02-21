export function addVisType(type){
  let types
  if(localStorage.getItem("types") === null){
    types = JSON.stringify([type]);
  } else {
    types = JSON.parse(localStorage.getItem('types'));
    type = types.concat(type);
  }
  localStorage.setItem("types", types);
}

export default localStorage;
