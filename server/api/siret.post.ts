export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const jwt = ''
  const sirenNumber = body.sirenNumber

  const response = await $fetch(
    `https://api.insee.fr/entreprises/sirene/V3/siren/${sirenNumber}`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    }
  )
  console.log(response)

  return { siret: response }
})
