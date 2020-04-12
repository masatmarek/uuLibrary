/* eslint-disable */
const codeType = string(/^[0-9a-zA-Z_\-]{2,64}$/);

const createLocationDtoInType = shape({
  code: codeType().isRequired(),
  name: string(),
  capacity: integer()
});
