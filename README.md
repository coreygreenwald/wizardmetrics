# Wizard Metrics

## Overview
This is a data collection and aggregation tool to help drive/simplify the process of looking at customer acquisition through their web journey. This was used in production by a few different applications during a beta run. This codebase powered the main application for `WizardMetrics`. Please feel free to download, install/deploy, and use this if you would like to take advantage of our customer acquisition management tool. Documentation and setup instructions coming soon!

This tool is composed of *two major components* that, in tandem, allow for ease of use.
1. Analytics Application and Dashboard
2. Data Collection Script (Simple Vanilla JS Client Code)

## Analytics Application and Dashboard (Admin/Companies)

### Purpose
To provide an easy to use and understand management system customer journey. This application provides a timeline that shows how the majority of a companies customers use the application as they move toward the designated completion step (ex. purchasing a product, providing an email for contact, etc.). 

### How it Works
Asynchronously the "Data Collection Script" tracks users on a particular website and feeds information regarding their activity back to the `express` backend which simply funnels it to the `postgreSQL` database. 

Later, the application runs scheduled jobs to categorize and process the data. Since the data is quite massive the data-processing step can take a significant amount of time.

After processing, the application then stores the results back in the `postgreSQL` database as well as a `redis` datastore to cache the data so the users of the analytics platform do not feel the burden of the massive database and relatively slow read speeds.

The application will provide companies a step-by-step path of how the common user moves through their application, show steps where there is massive customer attrition, match email addresses (when possible) to customers in the pipeline for remarketing emails, and more!

### Codebase
Most of the server code, database code, scheduled jobs, and utils are used within the analytics application. Within the `browser` directory the subdirectory `admin` designates the client-side code (react/redux app) for the analytics application.

## Analytic Application and Dashboard (Customers)

### Purpose
To relay individual customer data to the analytics application for aggregation and processing.

### How it Works
This is a simple script written in vanilla javascript for easy client plugin and minimal form. In fact, any company can effectively add two lines of HTML on their website/webapp and it will automatically begin the tracking process.

Most of the heavily lifting is processed by the core application backend (*described above*). The script utilizes the `localstorage` api to manage a clientId number and send DOM events regarding that users actions to the server.

### Codebase
The front-end script found in the `plugin` subdirectory of the `browser` folder. It sends information to the `express` routes found within the `server/plugin-routes` directory.