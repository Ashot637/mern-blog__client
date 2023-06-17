export const getTime = (createdAt: string) => {
  const time = new Date(createdAt);
  const min = time.getMinutes();
  const hour = time.getHours();
  const day = time.getDate();
  const month = time.getMonth() + 1;
  const year = time.getFullYear();

  if (min > 9) {
    return `${hour}:${min} ${day}/${month}/${year}`;
  }
  return `${hour}:0${min} ${day}/${month}/${year}`;
};
