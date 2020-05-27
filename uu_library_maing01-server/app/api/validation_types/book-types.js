/* eslint-disable */
const codeType = string(/^[0-9a-zA-Z_\-]{2,64}$/);

const bookCreateDtoInType = shape({
  locationCode: codeType().isRequired(),
  genreCodes: array().isRequired(),
  conditionCode: codeType().isRequired(),
  name: string().isRequired(),
  authorCodes: array().isRequired(),
  details: shape({
    publisher: string(),
    dateOfPublication: string(),
    language: string(),
    custody: string(),
    numberOfPages: string()
  })
});
const bookUpdateDtoInType = shape({
  code: codeType().isRequired(),
  genreCodes: array().isRequired(),
  conditionCode: codeType().isRequired(),
  name: string().isRequired(),
  authorCodes: array().isRequired(),
  details: shape({
    publisher: string(),
    dateOfPublication: string(),
    language: string(),
    custody: string(),
    numberOfPages: string()
  })
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
