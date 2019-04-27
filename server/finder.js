
module.exports = {

  findCurrent: function(array,id) {
    let index=false;
    for (let ind in array) {
      if (array[ind].id == id||array[ind].name == id) {
        index = ind;
      }
    }
    return index;
  }

}
