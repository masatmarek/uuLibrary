/* eslint-disable */
const codeType = string(/^[0-9a-zA-Z_\-]{2,64}$/);

const bookCreateDtoInType = shape({
  code: codeType().isRequired(),
  locationCode: codeType().isRequired(),
  name: string(),
  author: string()
});
const bookUpdateDtoInType = shape({
  code: codeType().isRequired(),
  name: string(),
  author: string()
});
const bookListDtoInType = shape({
  author: string(),
  name: string(),
  locationCode: codeType(),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer()
  })
});
const bookDeleteDtoInType = shape({
  code: codeType().isRequired()
});
const bookRelocateDtoInType = shape({
  code: codeType.isRequired(),
  locationCode: codeType.isRequired()
});
