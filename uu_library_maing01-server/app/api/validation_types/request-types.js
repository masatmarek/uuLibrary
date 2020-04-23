/* eslint-disable */

const codeType = string(/^[0-9a-zA-Z_\-]{2,64}$/);

const requestCreateDtoInType = shape({
  bookCode: codeType().isRequired(),
  from: date().isRequired(),
  type: oneOf(["borrow", "return"]).isRequired()
});
const requestListDtoInType = shape({
  type: oneOf(["borrow", "return"]),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer()
  })
});
