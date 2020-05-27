/* eslint-disable */
const codeType = string(/^[0-9a-zA-Z_\-]{2,64}$/);

const locationCreateDtoInType = shape({
  name: string(),
  address: shape({
    street: string().isRequired(),
    city: string().isRequired(),
    postalCode: string().isRequired()
  }).isRequired(),
  openingHours: array().isRequired(),
  capacity: integer()
});

const locationListDtoInType = shape({
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer()
  })
});

const locationDeleteDtoInType = shape({
  code: codeType().isRequired(),
  forceDelete: boolean()
});

const locationUpdateDtoInType = shape({
  code: codeType().isRequired(),
  name: string(),
  capacity: integer()
});
