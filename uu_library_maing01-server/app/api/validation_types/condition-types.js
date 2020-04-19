/* eslint-disable */
const codeType = string(/^[0-9a-zA-Z_\-]{2,64}$/);

const conditionCreateDtoInType = shape({
  code: codeType().isRequired(),
  name: shape().isRequired()
});
const conditionDeleteDtoInType = shape({
  code: codeType().isRequired()
});
const conditionListDtoInType = shape({
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer()
  })
});
const conditionGetDtoInType = shape({
  code: codeType().isRequired()
});
