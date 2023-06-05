<script setup>
const client = useSupabaseClient()

// Fetch all data from 'form_data' table on component mount
onMounted(async () => {
  const { data: rows, error } = await client.from('form_data').select('*')

  if (error) {
    console.error('Error: ', error)
  } else {
    data.value = rows
  }
})
</script>
<template>
  <div class="sans-serif bg-sky-700 h-screen flex justify-center items-center">
    <div class="container mx-auto px-4 sm:px-8">
      <div class="py-8">
        <div class="shadow rounded border-b border-gray-200">
          <table class="min-w-full bg-white">
            <thead class="bg-gray-800 text-white">
              <tr>
                <th
                  class="w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm"
                >
                  Siren Number
                </th>
                <th
                  class="w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm"
                >
                  Siren Name
                </th>
                <th class="text-left py-3 px-4 uppercase font-semibold text-sm">
                  Comment
                </th>
                <th class="text-left py-3 px-4 uppercase font-semibold text-sm">
                  City
                </th>
                <th class="text-left py-3 px-4 uppercase font-semibold text-sm">
                  Email
                </th>
                <th class="text-left py-3 px-4 uppercase font-semibold text-sm">
                  Contact Me
                </th>
              </tr>
            </thead>
            <tbody class="text-gray-700">
              <tr v-for="row in data" :key="row.id" class="hover:bg-gray-100">
                <td class="w-1/3 text-left py-3 px-4">{{ row.siretNumber }}</td>
                <td class="w-1/3 text-left py-3 px-4">{{ row.siretName }}</td>
                <td class="text-left py-3 px-4">{{ row.comment }}</td>
                <td class="text-left py-3 px-4">{{ row.city }}</td>
                <td class="text-left py-3 px-4">{{ row.email }}</td>
                <td class="text-left py-3 px-4">{{ row.contactMe }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
