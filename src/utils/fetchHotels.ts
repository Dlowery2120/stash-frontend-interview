export async function fetchHotels() {
  const response = await fetch('/data.json')
  if (!response.ok) {
    throw new Error('Failed to fetch hotel data')
  }
  return response.json()
}
