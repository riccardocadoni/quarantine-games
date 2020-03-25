export function getBoardCard(colorNum) {
  let color = "";
  switch (colorNum) {
    case 0:
      color = "yellow";
      break;
    case 1:
      color = "blue";
      break;
    case 2:
      color = "brown";
      break;
    case 3:
      color = "pink";
      break;
    case 4:
      color = "green";
      break;
    case 5:
      color = "orange";
      break;
    case 6:
      color = "grey";
      break;
    case 7:
      color = "last";
      break;
    default:
      break;
  }
  return color;
}

export function getBoardTopic(colorNum) {
  let topic;
  switch (colorNum) {
    case 0:
      topic = 23; //history
      break;
    case 1:
      topic = 12; // music //22; //geogrphy
      break;
    case 2:
      topic = 11; // film
      break;
    case 3:
      topic = 20; //mithology
      break;
    case 4:
      topic = 32; //cartoon //17; //science also 18
      break;
    case 5:
      topic = 9; // general knowledge
      break;
    default:
      break;
  }
  return topic;
}
