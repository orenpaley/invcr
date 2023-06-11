What tech stack will you use for your final project? We recommend that you use
React and Node for this project, however if you are extremely interested in
becoming a Python developer you are welcome to use Python/Flask for this
project.
2. Is the front-end UI or the back-end going to be the focus of your project? Or are
you going to make an evenly focused full-stack application?
3. Will this be a website? A mobile app? Something else?
4. What goal will your project be designed to achieve?
5. What kind of users will visit your app? In other words, what is the demographic of
your users?
6. What data do you plan on using? How are you planning on collecting your data?
You may have not picked your actual API yet, which is fine, just outline what kind
of data you would like it to contain. You are welcome to create your own API and
populate it with data. If you are using a Python/Flask stack are required to create
your own API.
7. In brief, outline your approach to creating your project (knowing that you may not
know everything in advance and that these details might change later). Answer
questions like the ones below, but feel free to add more information:
a. What does your database schema look like?
b. What kinds of issues might you run into with your API? This is especially
important if you are creating your own API, web scraping produces
notoriously messy data.
c. Is there any sensitive information you need to secure?
d. What functionality will your app include?
e. What will the user flow look like?
f. What features make your site more than a CRUD app? What are your
stretch goals?

## Lobster Invoice

#### stack: React, Node
#### focus: front end
#### output type: website

#### Goal
My goal is to create an accessible website for users to enter and instantly be able to generate, send and download an invoice. Additionally, I want that user to be able to create a login to save their invoices, update the status of an invoice, and save client data.

#### Data
Data will be accessed and modified via an api written with Node and express serving postgresQL database. There will be no imported data from an external api or other source.

#### Outline

This project will focus on creating a simple user experience with a straightforward real world use. By giving the user all the functionality they expect and the choice to create a login. This website is accessible for people to use to generate an invoice while also having an alluring quality due to the convenience of the tool. 

Upon entering the site, a user will be able to see a blank invoice and start filling out fields. This will involve very little technical background and allow for quick creation of invoices. The database will store tables for User, Invoice, and Client.

My stretch goal would be to take this idea and increase the possibilites exponentially. What other forms can conveniently be turned into a fill in and go template? Notecards, project boards, I can slowly expand the ideas and create a dropdown button to select a different generator. 