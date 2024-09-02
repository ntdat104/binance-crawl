export const getFinalValue = (value: number) => {
  if (value === undefined) {
    return 0;
  }

  const digit = getDigitFromValue(value);
  let formattedValue = value.toFixed(digit);
  formattedValue = parseFloat(formattedValue).toString();
  return formattedValue;
};

export const getDigitFromValue = (value: number) => {
  const absValue = Math.abs(value);

  if (absValue < 10) {
    return 3;
  }

  return 2;
};

export const formatPriceVND = (input: number | string, isTrunc = true) => {
  if (!input) return "";
  input = isTrunc ? Math.trunc(Number(input)) : input;
  return input
    .toString()
    .replace(/,/g, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatPrice = (value: number | string, defaultDigit?: number) => {
  if (!Number(value)) {
    return `0`;
  }

  value = value.toString();
  const priceNumber = parseFloat(value);
  const absValue = Math.abs(priceNumber);

  let digit: number;

  if (absValue < 0.0000001) {
    // 0.00000009876
    digit = 0;
  } else if (absValue < 0.000001) {
    // 0.0000009876
    digit = 10;
  } else if (absValue < 0.00001) {
    // 0.000009876
    digit = 9;
  } else if (absValue < 0.0001) {
    // 0.00009876
    digit = 8;
  } else if (absValue < 0.001) {
    // 0.0009876
    digit = 7;
  } else if (absValue < 0.01) {
    // 0.009876
    digit = 6;
  } else if (absValue < 0.1) {
    // 0.09876
    digit = 5;
  } else if (absValue < 1) {
    // 0.9876
    digit = 4;
  } else if (absValue < 10) {
    // 9.876
    digit = 3;
  } else {
    // 98.76
    digit = 2;
  }

  const formattedPrice = priceNumber.toLocaleString("en-US", {
    minimumFractionDigits: defaultDigit != undefined ? defaultDigit : digit,
    maximumFractionDigits: defaultDigit != undefined ? defaultDigit : digit,
  });

  return formattedPrice;
};
