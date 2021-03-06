Learnscaping: A training platform for UNC Grounds Services

This is a web app built by Ari Singer-Freeman, Ben Rosenberger, Garrett Olcott, and Aaron Zhang for a project presented by UNC Chapel Hill's Grounds Department and supported by Comp 523. The goal of this project was to build an education platform to teach landscaping curriculum in a friendly and efficient manner.

Our project is built on a Firebase backend/database and a jQuery/JS frontend with Bulma styling. Our tests are run by Selenium using Python.

Here is an overview of the project files:
  - Public folder: All rendered site files are here. Pages are separated into individual folders
  - tests.py: contains all testing code
  - presentationDemo.py: a file containing example selenium code used in our course's tech talk.

To run the site locally, we used browser-sync. Since the backend is hosted on firebase, you only need to host the front end to have full functioning access to the website.
We used npm to manage packages. You can view all required packages in package.json. At the time of deployment, all other required packages are connected via links and not accessed locally so installing should not be needed.

Steps to run:
  - npm install browser-sync
  - cd public
  - npx browser-sync -sw

Once on the site:
  - Users require an account to access the student and instructor views. Without an account, you will only be able to view the landing page and about page.
  - Once an account is created, you will be defaulted to a student role. In order to access the instructor side, you must manually switch your account attribute "isInstructor" to     true from the firebase console or have an existing instructor set your role from the User Control Panel.
  - From the student side, you will be able to view all assigned courses and their corresponding material and test.
  - The instructors have the ability to create, edit, and assign courses. They also have the ability to perform admin-like tasks such as deleting users or setting user roles.
