/* eslint-disable */
const initDtoInType = shape({
  authoritiesUri: uri().isRequired()
});

const createDtoInType = shape({
  code: codeType.isRequired(),
  name: shape().isRequired(),
  desc: shape(),
  genres: array().isRequired(),
  conditions: array().isRequired(),
  languages: array().isRequired(),
  primaryLanguage: string().isRequired()
});

const getDtoInType = shape({});
