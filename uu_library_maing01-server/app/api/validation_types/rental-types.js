/* eslint-disable */
const codeType = string(/^[0-9a-zA-Z_\-]{2,64}$/);

const rentalBorrowBookDtoInType = shape({
  code: codeType().isRequired()
});
