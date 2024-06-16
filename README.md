# Smart-Scale

The code in the following repository was used to demonstrate our solution's capabilities for our UOA Part IV ECSE Capstone Project.

I (Dan) was responsible for creating, testing, and building 99.9% of the code in this repository.

Tech Stack used: 
[Azure](https://azure.microsoft.com/en-us)
[Spring Boot](https://spring.io/projects/spring-boot)
[React-TS](https://www.typescriptlang.org/docs/handbook/react.html)
[NodeJS](https://nodejs.org/en)

## Run the Application Locally!

To run the web application, use the following steps: 

1: Clone the git repository locally.

2: Run ```npm install``` . This will install all of the relevant dependencies in a node_modules folder. 

3: Run ```npm run dev``` . This will start the local server at localhost:3000. This webapp was built using [Vite](https://vitejs.dev/guide/) as the framework of choice.

4: After some initial loading time, you should be greeted with this screen. 
**NOTE: The website is designed for 1920 x 1080px screens at 100% scale. Responsive scaling was out of the scope of the project.**
![Login Screen](/public/images/Login.png)

## Login

Only Google accounts authorised by an administrator will be able to access the screen. Therefore, you may log in using these two throwaway Google Accounts:

**Nurse Account**
Email: smartscalenurse@gmail.com
Password: 2RBZCXwKtgGJne

Nurses can view bookings that have been made by Receptionists, as well as view statistics for Baby Weights. 

The actual weighing functionality was done on the hardware-side of the capstone project.

**Receptionist Account**
Email: smartscalereceptionist@gmail.com
Password: e6HrvPuqyEcH4j

Receptionists can create bookings between parents and nurses. 

## Pages
For a view of some of the pages and website states, open the User Screens PDF in the root of the repository.
