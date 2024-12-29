// app/api/generate/route.ts

const tokens = [
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTUzYjFmMzQ2ODA5OWVkNDMwNTliZiIsImVtYWlsIjoibXRhbGhhbWF0aHNAZ21haWwuY29tIiwicm9sZXMiOlsiaW52aXRlIl0sImlhdCI6MTczNDg4ODY1OCwiZXhwIjoxNzM1NzUyNjU4fQ.w8fcXfSgJEfrnpWgFNd2ENnRFJULLJyTg2vcS8SIl6g",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTUzNTNlMzE4MDJkODljOTBlZmEyZSIsImVtYWlsIjoidGFsaGFyaWF6NTQyNTg2OUBnbWFpbC5jb20iLCJyb2xlcyI6WyJpbnZpdGUiXSwiaWF0IjoxNzM1MTk0NjYxLCJleHAiOjE3MzYwNTg2NjF9.ZFPwK_Vjgf0xWIfPvzFPgYLagC9laP2epvftoASoIfU",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTUzYWViMzQ2ODA5OWVkNDMwNTY0ZSIsImVtYWlsIjoibXRhbGhhLm1hdGhzQGdtYWlsLmNvbSIsInJvbGVzIjpbImludml0ZSJdLCJpYXQiOjE3MzUxOTQ3MTMsImV4cCI6MTczNjA1ODcxM30.JtV7alM4AORYdzBzpRBdKVP3qZEeYm_b6wQjsjug9jM",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTUzY2I3NWZjMTQ3MDAyN2I2YzQzOSIsImVtYWlsIjoibS50YWxoYS5tYXRoc0BnbWFpbC5jb20iLCJyb2xlcyI6WyJpbnZpdGUiXSwiaWF0IjoxNzM1MTk1MDIzLCJleHAiOjE3MzYwNTkwMjN9.MQcL6gGwGiSOm5t2y_QlVreVe9aLgEfFqdrHP5J3Q20",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTUzZGU3MzQ2ODA5OWVkNDMyMGIyZiIsImVtYWlsIjoibS50YWxoYW1hdGhzQGdtYWlsLmNvbSIsInJvbGVzIjpbImludml0ZSJdLCJpYXQiOjE3MzUxOTUwODcsImV4cCI6MTczNjA1OTA4N30.M7bH0P005-l4jMEHGHTtSdtebR7VYQHzl-EYDpljOVc",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTUzZTdlMzQ2ODA5OWVkNDMyMzlhNiIsImVtYWlsIjoibXRhbGhhbWEudGhzQGdtYWlsLmNvbSIsInJvbGVzIjpbImludml0ZSJdLCJpYXQiOjE3MzUxOTUxNDksImV4cCI6MTczNjA1OTE0OX0.EDMR4u8Jj-awJJfXFxvDdKwcEFDNouWVD3uO6En_oQU",
];
const image = async (text) => {
  try {
    const heroDescription = text;
    const aspectRatio = "1:1";
    const process = {
      env: {
        API_TOKEN: getRandomElement(tokens),
      },
    };
    // First API call to start the process
    const startResponse = await fetch(
      "https://api.marketing.deal.ai/ai-photos/start",
      {
        method: "POST",
        headers: {
          accept: "*/*",
          "content-type": "application/json",
          authorization: `Bearer ${process.env.API_TOKEN}`,
        },
        body: JSON.stringify({
          heroDescription,
          negativePrompt: "",
          tone: "",
          toneAdditionalInfo: "",
          aggressiveness: 0,
          hookCreative: 10,
          targetAudience: "everyone",
          colours: "",
          imageType: "",
          imageStyle: "",
          language: "English",
          emotions: "Intrigue",
          impacts: [
            { "Color Palette": true },
            { Lighting: true },
            { Composition: true },
            { "Perspective and Angle": true },
            { "Facial Expressions and Body Language": true },
            { "Textures and Patterns": true },
            { Symbolism: true },
            { "Contrast and Saturation": true },
            { "Context and Setting": true },
            { "Narrative Elements": true },
          ],
          businessDescription: "",
          isolation: "Black",
          rewrite: false,
          aspectRatio,
        }),
      }
    );

    const { token } = await startResponse.json();

    // Poll for results
    let result;
    let attempts = 0;
    const maxAttempts = 100; // Maximum polling attempts

    do {
      const statusResponse = await fetch(
        `https://api.marketing.deal.ai/ai-photos/query/${token}`,
        {
          method: "POST",
          headers: {
            accept: "*/*",
            authorization: `Bearer ${process.env.API_TOKEN}`,
          },
        }
      );

      result = await statusResponse.json();

      if (result.status === "processing") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        attempts++;
      }
    } while (result?.status === "processing" && attempts < maxAttempts);
    const respo = await fetch(
      `https://api.marketing.deal.ai/ai-photos/end/${token}`,
      {
        method: "POST",
        headers: {
          accept: "*/*",
          authorization: `Bearer ${process.env.API_TOKEN}`,
        },
      }
    );
    const dataa = await respo.json();
    if (attempts >= maxAttempts) {
      return NextResponse.json(
        { error: "Timeout: Image generation took too long" },
        { status: 408 }
      );
    }
    return dataa.response[0].url;
  } catch (error) {
    return { error: "Failed to generate image" };
  }
};
function getRandomElement(arr) {
  if (arr.length === 0) return null; // Handle empty array
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
module.exports =  {image}