# ReFi(Resource Finder)

## Overview
This project is developed as part of the Web Technologies class at the Faculty of Computer Science, Alexandru Ioan Cuza University in Iași.It aims to offer users a more appealing and convenient way to find, discover and create [creative-coding](https://github.com/terkelg/awesome-creative-coding) resources.
Team members: Isache Bogdan and Moloce Alin.

## Technologies Used
  - Frontend : HTML, CSS, JavaScript;
  - Backend : Node.js;
  - Database : MySQL;

## Features
  - JWT Secured Admin Accounts : Allows an admin to create an account, log in and edit his profile. The authentication logic is based on JWT;
  - Guest : Users can navigate the website and search for resources without an account;
  - Customized Search : The searchpage provides natural language processing and offers filters in order to offer users a felxible search;
  - PageSpeedInsights : All webpages ensure a Performance score over 90 which offers fast loading pages and a better user expierence;

 ## Project Architecture
 The project is composed from a FAT Client that servers HTML, CSS and JavaScript files. The server side is split into multiple Microservices that have granular responsibilities and a Gateway that offers a better scalability of the project and a more efficient communication between microservices for the long term. 
 
![ReFiC2 drawio](https://github.com/Alinux21/web_project/assets/125958940/4677756f-6f14-4313-b197-cd9cf4614b42)

