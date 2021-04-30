Learnscaping: A training platform for UNC Grounds Services

This is a web app built by Ari Singer-Freeman, Ben Rosenberger, Garrett Olcott, and Aaron Zhang for a project presented by UNC Chapel Hill's Grounds Department. The goal of this project was to build an education platform to teach landscaping curriculum in a friendly and efficient manner.

Our project is built on a Firebase backend and a jQuery/JS frontend with Bulma styling. Our tests were run by Selenium.

Here is an overview of the project files:
  - Public folder: All rendered site files are here. Pages are separated into individual folders
  - tests.py: contains all testing code
  - presentationDemo.py: a file containing example selenium code used in our course's tech talk.

To run the site locally, we used browser-sync. Since the backend is hosted on firebase, you only need to host the front end to have full functioning access to the website.
We used npm to manage packages. You can view all all required packages in package.json. At the time of deployment, all other required packages are connected via links and not accessed locally so you should not need to install.

Steps to run:
  - npm install browser-sync
  - cd public
  - npx browser-sync -sw
