import { BASE_URL } from '../config';

export function setImageFormat(url) {
  return [BASE_URL, url].join('/');
}

export function setNumericComma(value) {
  if (value === undefined || value === null) return '';
  const parts = value.toString().split('.');
  let decimalPart = parts[1];
  if (parts[1] !== undefined) {
    decimalPart = decimalPart.substring(0, 2);
  }
  return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (parts[1] !== undefined ? `.${decimalPart}` : '');
}

export function calcDiscountedPrice(props) {
  if (props.discountRate <= 0) return props.price;
  const calculatedPrice = props.price * ((100 - props.discountRate) / 100);
  const roundDownPrice = Math.floor(calculatedPrice / 1000) * 1000;
  return roundDownPrice;
}

export function mergeArray(arr, newOne, uniqKey) {
  const newArr = [...arr];
  const findIdx = arr.findIndex((e) => e[uniqKey] === newOne[uniqKey]);
  if (findIdx < 0) {
    newArr.push(newOne);
  } else {
    newArr.splice(findIdx, 1, { ...newOne });
  }
  return newArr;
}
