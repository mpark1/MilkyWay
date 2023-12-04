export function pagination(data, pageNumber, pageSize, setPageNumber) {
  let startIndex = (pageNumber - 1) * pageSize;
  if (startIndex >= data.length) {
    return [];
  }
  setPageNumber(pageNumber);
  return data.slice(startIndex, startIndex + pageSize);
}
