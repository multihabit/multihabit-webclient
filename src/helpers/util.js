function getNowInteger() {
  const now = new Date();
  return (now.getFullYear()*10000) + ((now.getMonth()+1)*100) + (now.getDate());
}

function calculateInputVal(input, value) {
  const regex = new RegExp(/^([+-]?)(\d+)(?::(\d{1,2}))?(?::(\d{1,2}))?$/);
  let result;
  let tmpVal;

  let inputParts = input.match(regex);
  inputParts.shift();
  const modifier = inputParts.shift();
  inputParts = inputParts.filter((i) => i !== undefined).map((i) => parseInt(i));

  switch (inputParts.length) {
    case 1:
      tmpVal = inputParts[0];
      break;
    case 2:
      tmpVal = inputParts[0]*60 + inputParts[1];
      break;
    case 3:
      tmpVal = inputParts[0]*3600 + inputParts[1]*60 + inputParts[2];
      break;
  }

  if (modifier) {
    if (modifier == '+') {
      result = Math.max(value.value + tmpVal,0);
    } else if (modifier == '-') {
      result = Math.max(value.value + (tmpVal*-1),0);
    }
  } else {
    result = Math.max(tmpVal,0);
  }

  return result;
}

export {
  getNowInteger,
  calculateInputVal
};
