async function getRandomDog() {
  const url = "";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result.message);
    cuteDog.src = result.message;
  } catch (error) {
    console.error(error.message);
  }
}