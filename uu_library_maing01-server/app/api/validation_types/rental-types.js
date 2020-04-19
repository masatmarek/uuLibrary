/* eslint-disable */
const codeType = string(/^[0-9a-zA-Z_\-]{2,64}$/);

const rentalConfirmBorrowBookDtoInType = shape({
  requestCode: codeType().isRequired(),
  emailSubject: string().isRequired(),
  emailText: string().isRequired()
});
