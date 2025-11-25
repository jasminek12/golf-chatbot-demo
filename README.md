# Golf Chatbot Demo

**Made for Paradise Golf**

This project is a chatbot demo which helps users find golf courses in Florida, check weather forecasts, collect reviews, and book tee times with Google Calendar integration.

---

## **Current Progress**

- Backend setup with **Node.js** and **Express**
- Integration with **GolfCourseAPI** to fetch 10 golf courses in Florida
- Project structure ready for adding:
  - Weather API integration
  - Reviews collection
  - Tee time booking
  - Google Calendar integration
  - Gemini chatbot responses

---

## **Project Structure**

'''
golf-chatbot-demo/
├─ backend/
│ ├─ src/
│ │ ├─ server.js
│ │ ├─ routes/
│ │ │ ├─ courses.js
│ │ │ ├─ weather.js
│ │ │ ├─ reviews.js
│ │ │ └─ booking.js
│ ├─ data/
│ │ └─ reviews.json
│ ├─ .env
│ └─ package.json
'''

---

## **Technologies Used**

- **Node.js** + **Express**  
- **GolfCourseAPI** (for golf course data)  
- **OpenWeather API** (for 7-day forecast) – to be integrated  
- **Google Gemini API** (for chatbot responses) – to be integrated  
- **Google Calendar API** – to be integrated  
- **JSON file storage** for reviews


## **Setup Instructions (so far)**

1. Clone the repository:

```bash
git clone https://github.com/jasminek12/golf-chatbot-demo.git

2. Install dependencies:
cd golf-chatbot-demo/backend
npm install

3. Create a .env file with API keys:
PORT=5000
GOLF_API_KEY=<your_golf_api_key>
OPENWEATHER_KEY=<your_openweather_key>
GEMINI_KEY=<your_gemini_key>
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
REDIRECT_URI=urn:ietf:wg:oauth:2.0:oob

4. Start the server:
npm run dev

5. Test the GolfCourseAPI endpoint:
http://localhost:5000/api/courses

