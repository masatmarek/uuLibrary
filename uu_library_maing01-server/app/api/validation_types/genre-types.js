/* eslint-disable */
const codeType = string(/^[0-9a-zA-Z_\-]{2,64}$/);

const genreCreateDtoInType = shape({
  code: codeType().isRequired(),
  name: shape().isRequired()
});
const genreDeleteDtoInType = shape({
  code: codeType().isRequired()
});
const genreListDtoInType = shape({});
const genreGetDtoInType = shape({
  code: codeType().isRequired()
});
