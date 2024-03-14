## Introduction

Welcome to the sample Incident Management Typescript CAP application.
The main purpose of the application is to serve as a template/reference point for developing SAP CAP applications using the new CDS-TS Dispatcher (https://github.com/dxfrontier/cds-ts-dispatcher) and other new libraries, methodologies and best-practices.
The use case is pretty simple: allow users to view, edit and create incidents.

## Project Structure

```
.
├── app                                             (Content for UI frontends)
│   └── incidents                                   (UI app used by the support users. App uses sap fiori elements)
│       ├── webapp
│       │   └──── ...
│       ├── annotations.cds                         (Annotations file for the UI app)
│       ├── package.json                            (Module metadata and configuration)
│       ├── ui5-deploy.yaml
│       ├── ui5.yaml
│       ├── xs-app.json
│   └── launchpage.html                             (Local launch page for local testing that mimics a SAP Build Work Zone site)
│   └── services.cds                                (File to ensure all annotations are loaded)
├── db                                              (Domain models files and folders)
│   └── data                                        (CSV data files for DB)
│   └── i18n                                        (i18n file that stores the translation texts for the annotation files and those annotated directly)
│   └── schema.cds                                  (Domain model specification)
├── srv                                             (Service models)
│   └── controller                                  (Source files for the service(s))
│       ├── processor-service                       (Implementation of functions, actions and handlers specific to the service)
│       │   └──── handler                           (Handler files)
│   └── processor-service.cds                       (Service definition file)
│   └── processor-service.ts                        (CDS Dispatcher file for dispatching and managing entities)
├── tests                                           (Test files for testing with ts-jest)
│   └── setup.ts                                    (To allow jest testing without precompiling Typescript files)
│   └── test.ts                                     (Test scenarios)
├── .cdsrc.json                                     (Test Users and Auth tokens for connecting to external services)
├── .eslintrc                                       (Linting config file)
├── .gitignore                                      (Git ignore config)
├── jest.config.js                                  (Jest config file)
├── mta.yaml                                        (Deployment config file)
├── package.json                                    (project metadata and configuration)
├── README.md                                       (This file)
├── tsconfig.json                                   (Typescript config file)
├── xs-security.json                                (XSUAA config)
...
```

## Project Repository

Login to Github and clone the repository at https://github.com/memgavdilabs/incident-management.git

## Preliminaries

1. Ensure you have the latest LTS version of Node.js, @sap/cds-dk and setup your local development (see [Setup for Local Development](https://cap.cloud.sap/docs/get-started/jumpstart#setup))
2. Ensure you have the latest version of MTA Build Tool (mbt)
   ```sh
    mbt -v
   ```
   If not, install it
   ```sh
    npm install -g mbt
   ```
3. _Optional:_ Preferred development in Visual Studio Code. Alternatively, you could use SAP Business Application Studio
4. If you have not installed the packages yet, then in the root folder run
   ```sh
   npm install
   ```
   Also ensure to run the above command in the app > incidents folder

## Generating the @cds-models folder

- To generate the @cds-models folder which will contain the types you can do so using automatically, by opening your _service.cds_ file and saving the file.
  Alternatively, you can also generate it manually, from the root folder, in a terminal run
  ```sh
  npm run build:models
  ```

## Running the project locally

- To run the service locally, from the root folder, in a terminal run

  ```sh
  npm run start
  ```

  When asked to log in, refer to the users mentioned in the package.json file for test usernames and passwords

- To run the Incident Management UI App, from the root folder, in a terminal run

  ```sh
  npm run watch-incidents
  ```

  If you wish to run the UI app using a launchpad setup instead, then from the root folder, in a terminal run

  ```sh
  npm run watch-incidents-launchpad
  ```

- To run the jest tests, from the root folder, in a terminal run

  ```sh
  npm run test
  ```

## Building and deploying the project to SAP BTP Cloud Foundry

- To build the project for production profile, from the root folder, in a terminal run

  ```sh
  npm run build:production
  ```

- To build the mta and deploy to SAP BTP Cloud Foundry in one step, from the root folder, in a terminal run

  ```sh
  npm run deploy
  ```

  Make sure you have logged in to SAP BTP Cloud Foundry first !!!
