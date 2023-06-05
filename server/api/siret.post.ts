export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const jwt = useRuntimeConfig().public.sirenToken
  const sirenNumber = body.sirenNumber

  const response = await $fetch(
    `https://api.insee.fr/entreprises/sirene/V3/siren/${sirenNumber}`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    }
  )
  return { siret: response }
})
