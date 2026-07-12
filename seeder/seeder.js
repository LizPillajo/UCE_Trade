import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import axios from 'axios';
import { faker } from '@faker-js/faker';

const firebaseConfig = {
  apiKey: "AIzaSyBvimUmT5AeHp2kGUo8hATZXq-J22lcH5I",
  authDomain: "uce-trade-e015e.firebaseapp.com",
  projectId: "uce-trade-e015e",
  storageBucket: "uce-trade-e015e.firebasestorage.app",
  messagingSenderId: "495142170941",
  appId: "1:495142170941:web:600d39dc5d0ea0584e9554"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const API_GATEWAY = process.env.API_GATEWAY_URL || "http://localhost:8000/api/v1";

async function seed() {
    console.log(`Starting seeder. Target API Gateway: ${API_GATEWAY}`);
    let successCount = 0;
    
    for (let i = 0; i < 50; i++) {
        // Generate @uce.edu.ec for half of them to make them students
        const isStudent = i % 2 === 0;
        const email = isStudent 
            ? faker.internet.email({ provider: 'uce.edu.ec' }) 
            : faker.internet.email();
        const password = "Password123!";
        const name = faker.person.fullName();

        try {
            console.log(`\n[${i+1}/50] Creating user in Firebase: ${email}`);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const token = await user.getIdToken();

            console.log(`[${i+1}/50] Registering user in MS1 via /auth/login...`);
            // This triggers AuthService.authenticate() which registers the user if new
            await axios.post(`${API_GATEWAY}/auth/login`, null, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            console.log(`[${i+1}/50] Updating user profile in MS1...`);
            const ms1Payload = {
                fullName: name,
                faculty: "Ingeniería",
                avatarUrl: faker.image.avatar(),
                description: faker.person.bio(),
                githubUser: faker.internet.username()
            };

            await axios.put(`${API_GATEWAY}/users/${user.uid}`, ms1Payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            console.log(`[${i+1}/50] ✅ Successfully registered and updated user: ${name}`);

            if (isStudent) {
                console.log(`[${i+1}/50] Creating venture for student in MS2...`);
                
                // Fetch random image
                const imageUrl = faker.image.urlLoremFlickr({ category: 'business' });
                const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                const imageBuffer = Buffer.from(imageResponse.data, 'binary');
                
                const formData = new FormData();
                formData.append('title', faker.company.catchPhrase());
                formData.append('description', faker.company.buzzPhrase());
                formData.append('category', faker.helpers.arrayElement(['Technology', 'Food', 'Tutoring', 'Services']));
                formData.append('price', faker.commerce.price({ min: 10, max: 200 }));
                
                // We use Blob for FormData in Node 18+ native Fetch/FormData
                formData.append('file', new Blob([imageBuffer], { type: 'image/jpeg' }), 'venture.jpg');

                const BASE_API = API_GATEWAY.replace('/v1', '');
                const ventureApi = BASE_API.replace('/v1', '');
                await axios.post(`${ventureApi}/ventures`, formData, {
                    headers: { 
                        'Authorization': `Bearer ${token}`
                        // axios sets the multipart header automatically when passing formData
                    }
                });

                console.log(`[${i+1}/50] ✅ Successfully created venture for ${name}`);
            }
            
            successCount++;

        } catch (error) {
            console.error(`[${i+1}/50] ❌ Error with user ${email}:`, error?.response?.data || error.message);
        }
    }
    
    console.log(`\nSeeding complete! Successfully processed ${successCount}/50 users.`);
    process.exit(0);
}

seed();
