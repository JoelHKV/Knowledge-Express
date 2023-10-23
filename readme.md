# Knowledge Express
[Knowledge Express is deployed to GitHub](https://JoelHKV.github.io/Knowledge-Express/)

## General Information
Knowledge Express is an educational web app designed to


is an exploratory app 
for examining the possibilities of AI for learning. 
Knowledge is expressed by language yet reading large blocks of text
is challenging for many people these days.


Get ready for an 

exciting and educational adventure aboard the Knowledge Express!

## Introduction



## Features

Knowledge Express is a first-person educational game where players act as
train drivers. The railroad in front of the train driver contains 
railroad signs and the educational material is written in these signs.


<img src="https://raw.githubusercontent.com/JoelHKV/Knowledge-Express/main/public/Fig1.jpg" width="600" height="auto">



This approach has several inherint advantages:

- Users can control the content of the upcoming signs, making it an interactive learning exprerience
- Users can control the speed of the train, making it suitable for fast and slow learners
- Users are exposed to only a limited amount of information at once, making it easy to digest
- Users experience motion while learning, making it engaging to keep going.

### From QnA to AnQ

Knowledge Express follows a modified QnA -format (=Question and Answer). The extra twist is that 
instead of merely answering a question, it also provides a list of 
follow-up questions. The advantage of this AnQ -format (=Answer and Questions) is that it allows 
users to dive into a topic as much as they want without the need to come up
with new questions. Since the list of follow-up questions is given, users can
merely choose the one that interest them the most.







## Instructions
 
Instructions are displayed as railroad signs, similar to all other information.
They are displayed in the beginning or anytime the '?' button is clicked.

The following signs are displayed:


### Welcome!

- Welcome to Knowledge Express! 
- This special train ride is all about learning.
- It teaches you nearly everything you have ever wanted to know.
- Whether you're a seasoned traveler or just starting your journey...
- These instructions will guide you through the experience.
- If you already know what to do, click MQ, WQ, or LQ to start.
- Otherwise, keep reading these instructional signs.

### Controlling the Train

- You can control the speed of the train in several different ways:
- Use the throttle lever located in the middle of the control panel.
- Turn the mouse wheel up and down.
- Click any sign once, and the train will stop in front of it.
- To resume motion, use the throttle lever, the mouse wheel, or simply click an empty part of the screen.

### Gameplay Overview

- First, you will either choose a question or type in a question.
- The WQ button will display a series of World Questions to choose from.
- The LQ button will display a series of Life Questions to choose from.
- Alternatively, the MQ (My Question) button allows you to ask whatever you want. Simply type in your question and press the "Submit" button.
- Whether you choose a question or type in a question, a red border will appear around it. This indicates that ChatGPT is thinking about the question.
- Once the answer is ready, the answer sign will "fly" right in front of the train.
- After you have read the answer, click the answer sign, and it will fly away.

### Exploring Topics

- Next, you will see a series of signs that contain follow-up questions.
- Double-click any follow-up question, and ChatGPT will start thinking about it.
- After reading the answer, you will be presented with new follow-up questions.
- By always asking the follow-up question of your interest, you can delve into any topic as deeply as you want.

### Changing Topics and Have Fun!

- Once you are done with the topic, you can click MQ, WQ, or LQ to restart.
- Enjoy your learning journey with Knowledge Express!
- Now click MQ, WQ, or LQ to start, or press "?" to read the instructions again.


## Architectural Choices

The following architectural choices were made:

- All 3D objects, particularly the signs, where made as autonomic as possible.
- Uncessary re-renderings were avoided as much as possible
- Strict division of the 3D scene and the rest of the app was implemented
- Prop drilling was used instead of a state management library

The purpose of these choices was to equip the project owner to handle more 
complex yet similar projects in a performant manner. 

## Getting Started
To run this React app locally, follow these 4 steps:
1. **Clone the Repository:**
```
git clone https://github.com/JoelHKV/Knowledge-Express.git
```
2. **Navigate to the Project Directory:**
```
cd your-react-app
```
3. **Install Dependencies:**
```
npm install
```
4. **Start the Development Server:**
```
npm run dev
```

## Custom API
 
Refer [API Documentation](#api-documentation) for details.  
 
 
## Folder Structure
The project directory is organized as follows:

* src/: This folder contains the main source code
* main.jsx: The JavaScript entry point
* App.jsx: The main entry point
* App.css: The main CSS styles specific to App.jsx
* assets/: Stores static assets like images, fonts, etc
* components/: Houses React components
* hooks/: Contains custom React hooks
* utilities/: Holds utility functions
* testing_scripts/: Contains testing scripts

## Data
All data for this project has been generated exclusively by ChatGPT 3.5. 
 

## Database Schema
### All Interconnections
Data related to interconnections between concepts is stored in Firestore 
under the following structure:

 - **`conceptBrowser`** (Collection)
    - **`finalConceptData_0`** (Document)
    - **`finalConceptData_1`** (Document)
    - etc
        - **`abstract`** (Number): Rating from 0 (concrete) to 100 (abstract)
        - **`branch`** (Array): The starting concept, its level, ...
        - **`ordered_concepts`** (Array of Strings): An array of the 8 most related concepts to this concept, ordered by relatedness

### Concept Details
Details about individual concepts are stored in Firestore using the following structure:

 - **`conceptNames`** (Collection)
    - **`[CONCEPT NAME]`** (Document)
        - **`definition`** (String): A concise summary (about 70 words) about the concept
        - **`date`** (Timestamp): The date and time when ChatGPT generated the definition
        - **`definition_model_version`** (String): The version of ChatGPT used to generate the definition

Where `CONCEPT NAME` is the name of each concept.

## API Documentation

### Overview
This API allows you to retrieve information about concepts and 
their interconnections from Firestore using a Google Cloud Function.
 
#### Get All Interconnections (GET)

Get Answer and 6 Follow-Up Questions (GET)


### Endpoint 
- **URL:** `https://europe-north1-koira-363317.cloudfunctions.net/knowledgeExpressRequest?question=ENTER_QUESTION_HERE`
- **Description:** Returns json with keys "answer", "q1", "q2", "q3", "q4", "q5", and "q6"
- **Usage:** Replace `ENTER_QUESTION_HERE` with the desired concept name and make a GET request to the URL.

### Access Restrictions and Usage
To ensure the security and reliability of this API, the cloud function
checks the URL and the IP address of the request. Automatic access is granted
to the URL of the deployed version and the IP address of my own development server.

If you wish to use this API, please don't hesitate to contact the [Project owner](#contact-information).


 

## Technologies Used
The frontend is written in JavaScript (React), HTML, and CSS.  The backend is written in Python.

## Testing


## Answer and Follow-Up Question Data

ChatGPT bad a counting, give some slack
not consistne formating, have to process carefully

 
## Known Issues

- Mouse wheel for speed control works only when the point is located in the control panel
- 
## Roadmap
- Railroad signs could contain information beyond text. For example more abstract 
question could be placed higher than concrete questions. Answers signs could also be color-coded for 
example how certain ChatGPT is about the answer.

## Contact Information

For inquiries or collaboration opportunities, please feel free to contact me via email. 
My name is listed on the [Profile page](https://github.com/JoelHKV), and I am using Gmail.

