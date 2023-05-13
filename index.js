const zq = new ZeroQ.default({
  organization: 'zero-q',
  token:
    'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJKd21sTm04RHo5T3pLSDV5NTNDOTduNk9BZzEyIiwidXNlciI6eyJpZCI6MjEzNDA1NywidXNlcl9pZCI6MjEzNDA1NywidWlkIjoiSndtbE5tOER6OU96S0g1eTUzQzk3bjZPQWcxMiIsIm5hbWUiOiJSYWZhZWwgSGlkYWxnbyIsInJ1dCI6IjEwMTE2ODAzLTQiLCJwaG9uZSI6Iis1Njg2NTY0NTY3OCIsInR5cGUiOiJhZG1pbiIsImVtYWlsIjoicmhpZGFsZ29AemVyb3EuY2wiLCJwcm92aWRlciI6Inplcm9xIiwibWV0YSI6eyJuYW1lIjoiUmFmYWVsIEhpZGFsZ28iLCJydXQiOiIxMDExNjgwMy00IiwicGhvbmUiOiIrNTY4NjU2NDU2NzgiLCJ0ZW1wb3JhcnkiOmZhbHNlfX0sInR5cGUiOiJhZG1pbiIsImlkIjoyMTM0MDU3LCJ1c2VyX2lkIjoyMTM0MDU3LCJlbWFpbCI6InJoaWRhbGdvQHplcm9xLmNsIiwicHJvdmlkZXIiOiJ6ZXJvcSIsImlhdCI6MTY4MDI5MjY0MywiaXNzIjoiWmVyb1EifQ.ngcqrjIKLv_ZGBAFy-zNCLG1Cmiu-G6k-QUmAE7w48hf7n198cQ7Ls4ctncMEfl-V9_2UijnYXOSkaYzBjZINw',
})
console.log(zq)
const dataReserve = zq.getUserReservations().then((res) => {
  console.log(res)
})

//temporary user: el organization se envia como un argumento del metodo newZeroqUserTmp a diferencia del usuario normal que se envia como propiedad del objeto config
const zqTemporary = new ZeroQ.default.newZeroqUserTmp(
  {
    organization: 'zero-q',
  },
  'zero-q'
)

zqTemporary.then((zqTemp) => {
  console.log('temporary', zqTemp)
  zqTemp.getUserReservations().then((res) => {
    console.log('res', res)
  })
})
