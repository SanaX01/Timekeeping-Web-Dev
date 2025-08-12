export const config = {
  BASE_URI: process.env.NODE_ENV === "production" ? "https://timekeeping-web-dev.vercel.app" : "http://localhost:3000",
  timeInOutApi: "http://localhost:3000/api/sheet-data",
};
