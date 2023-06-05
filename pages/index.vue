<script setup>
const client = useSupabaseClient()

const sirenNumber = ref(null)
const siretName = ref(null)
const unknownSiren = ref(false)
const comment = ref('')
const city = ref('')
const email = ref('')
const contactMe = ref(false)

const validsirenNumber = computed(() => {
  const validSiren = validateSirenNumber(sirenNumber.value)
  if (validSiren) {
    getSiren()
  }

  return validSiren
})

const validateSirenNumber = (number) => {
  const siretRegex = /^\d{9,}$/
  return siretRegex.test(number)
}

const lookingForSiren = ref(false)

async function getSiren() {
  lookingForSiren.value = true
  const result = await fetch(`/api/siret`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sirenNumber: sirenNumber.value
    })
  })

  if (result.status !== 200) {
    siretName.value = null
    lookingForSiren.value = false
    unknownSiren.value = true
  } else {
    unknownSiren.value = false
    const data = await result.json()
    const periodesUniteLegale = data.siret?.uniteLegale.periodesUniteLegale[0]
    if (periodesUniteLegale.nomUniteLegale) {
      siretName.value = periodesUniteLegale.nomUniteLegale
    } else {
      siretName.value = periodesUniteLegale.denominationUniteLegale
    }
    lookingForSiren.value = false
  }
}

const submittedForm = ref(false)

// Post to DB
async function submitForm() {
  const data = {
    siretNumber: sirenNumber.value,
    siretName: siretName.value,
    comment: comment.value,
    city: city.value,
    email: email.value,
    contactMe: contactMe.value
  }
  // Insert a single row
  const output = await client.from('form_data').insert(data)

  if(output.error) {
    console.log('error', output.error)
    submittedForm.value = false
  } else {
    submittedForm.value = true
  }
}
</script>

<template>
  <div class="h-screen bg-sky-700 flex justify-center items-center">
    <form
      class="w-full max-w-xs bg-white flex flex-col py-5 px-8 rounded-lg shadow-lg"
      action=""
    >
      <!-- Numéro de Siren - Number - no validation -->
      <label class="text-gray-700 font-bold py-2" for="">Numéro de Siren</label>
      <input
        v-model="sirenNumber"
        class="text-gray-700 shadow border rounded border-gray-300 focus:outline-none focus:shadow-outline py-1 px-3 mb-3"
        type="text"
        placeholder="Numéro de Siren"
      />
      <p v-if="sirenNumber && !validsirenNumber" class="text-red-500">
        Au moins 9 chiffres
      </p>
      <!-- Loading dots when looking for siret -->
      <div v-if="lookingForSiren" class="flex justify-center items-center">
        <svg
          aria-hidden="true"
          class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>
      <p v-if="siretName" class="text-gray-700">
        Nom de Siren : {{ siretName }}
      </p>
      <p v-if="unknownSiren" class="text-red-500">Siren inconnu.</p>
      <!-- Commentaire - TextArea -->
      <label class="text-gray-700 font-bold py-2" for="">Commentaire</label>
      <textarea
        v-model="comment"
        class="text-gray-700 shadow border rounded border-gray-300 focus:outline-none focus:shadow-outline py-1 px-3 mb-3"
        placeholder="Commentaire"
      ></textarea>
      <!-- DropBox - Ville -->
      <label class="text-gray-700 font-bold py-2" for="">Ville</label>
      <select
        v-model="city"
        class="text-gray-700 shadow border rounded border-gray-300 focus:outline-none focus:shadow-outline py-1 px-3 mb-3"
      >
        <option value="">Ville</option>
        <option value="Paris">Paris</option>
        <option value="Lyon">Lyon</option>
        <option value="Marseille">Marseille</option>
      </select>
      <!-- Email -->
      <label class="text-gray-700 font-bold py-2" for="">Email</label>
      <input
        v-model="email"
        class="text-gray-700 shadow border rounded border-gray-300 focus:outline-none focus:shadow-outline py-1 px-3 mb-3"
        type="email"
        placeholder="Email"
      />
      <!-- Checkbox - Recontacter moi -->
      <div class="flex justify-between items-center mb-3">
        <label class="text-gray-700 font-bold" for="">Recontacter moi</label>
        <input
          v-model="contactMe"
          class="mr-2 leading-tight"
          type="checkbox"
          value="value"
        />
      </div>

      <!-- Submit Button -->
      <div class="flex justify-between items-center my-4">
        <button
          class="bg-sky-500 hover:bg-sky-700 text-white font-bold rounded py-2 px-4"
          @click.prevent="submitForm"
        >
          Soumettre
        </button>
      </div>
      <div>
        <p v-if="submittedForm" class="text-green-500">Formulaire soumis !</p>
      </div>
    </form>
  </div>
</template>
