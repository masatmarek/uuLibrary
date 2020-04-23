/* eslint-disable */
const codeType = string(/^[0-9a-zA-Z_\-]{2,64}$/);

const locationCreateDtoInType = shape({
  code: codeType().isRequired(),
  name: string(),
  capacity: integer()
});

const locationListDtoInType = shape({
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer()
  })
});

const deleteDtoInType = shape({
  code: codeType().isRequired(),
  forceDelete: boolean()
});