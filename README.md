[![Build Status](https://travis-ci.org/myspecialway/my-special-way-server.svg?branch=master)](https://travis-ci.org/myspecialway/my-special-way-server)
[![codecov](https://codecov.io/gh/myspecialway/my-special-way-server/branch/master/graph/badge.svg)](https://codecov.io/gh/myspecialway/my-special-way-server)
[![BCH compliance](https://bettercodehub.com/edge/badge/myspecialway/my-special-way-server?branch=master)](https://bettercodehub.com/results/myspecialway/my-special-way-server)
[![Known Vulnerabilities](https://snyk.io/test/github/myspecialway/my-special-way-server/badge.svg?targetFile=package.json)](https://snyk.io/test/github/myspecialway/my-special-way-server?targetFile=package.json)

# my-special-way-server

Server part of the My special way project enabling indoor navigation for schools

Demo master version running at _(link to be added here)_

## Table of Content

1. [Genesis](#Genesis)
1. [Oath](#Oath)
1. [Getting Started](#getting-started)
   1. [Prerequisites](#prerequisites)
   1. [Configurations](#configurations)
   1. [First Thing First](#first-thing-first)
   1. [Running the tests](#running-the-tests)
   1. [Coding style tests](#coding-style-tests)
1. [Contribution Guide](#contribution-guide)
1. API Documentation
1. CI/CD

## Genesis

"In the beginning God created the heavens and the earth" _(Genesis 1)_

Welcome to **My Special Way** documentation. Below you will find all what you need to start contributing to this awesome project, but, first thing first. Everything should begin with slack, please join slack [here](https://myspecialway.slack.com/).
We could not empasice enough how important it is to stay connected. Once joined please find the relevand channels to be a member of. We would like to recommend for this bare minimum:

- `broadcasts` - all important notifincations are there (please checked pinned messages for more awesome links)
- `msw-portal` - for portal dev discussions
- `msw-server` - for server dev discussions
- `tech-discussions` - all important tech decisions happenning there

The links below are **must** visit links:

- TBD

## Oath

**I hereby solemnly declare to follow the oath below**

1. I will not produce harmful code.
   - I will not intentionally write code with bugs.
   - This means: Do your best.
2. I will not produce code that's not my best.
3. I will provide with each release a quick, testable & repeatable proof that the code works.
4. I will not avoid release that will impede progress.
   - Short term rapid releases
5. I will fearlessly and relentlessly improve the quality of code.
   - I will never make the code worse.
6. I will keep productivity high.
   - I won't do anything that decreases productivity.
7. I will continuously ensure others can cover for me and I can cover for them.
8. I will produce estimates without certainty, and I will not make promises without certainty.
9. I will never stop learning and improving my craft.
   _by Uncle Bob_

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See CI/CD for notes on how to deploy the project on a live system.

### Prerequisites

In this project we use various tools and technologies for development and deployment, to be able to work you will have to install the following:

- [Nodejs](http://nodejs.org)
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- yarn `npm i -g yarn`
- typescript `npm i -g typescript`

### Configurations

Configurations are declared within the `.env` file. In the repository, `.env-example` file is available with the full list of variable available.

These variables can be either declared in `.env` file as described above or passed as environments variables. Server support validation for env variables and will fail to load if some of them are missing or in wrong format.

_NOTE: if you are adding new env variables please make sure to add them into `.env-example` file with explanation._

**NEVER COMMIT `.env` FILE TO REPOSITORY**

### Database Seed

To seed initial data please run seed script:

    yarn seed

**The db name will be taken from .env variables**

The following users will be created:

- `principle`
- `teacher`
- `student`

The initial password for all users: **Aa123456**

### First Thing First

Run the following commmands in your terminal to get your code running on your local machine:

Get the code

```
git clone https://github.com/myspecialway/my-special-way-server.git
cd my-special-way-server
```

Install dependencies

```
yarn
```

Start the server

```
yarn start
```

### Running the tests

The below will run both the Unit and the E2E tests

```
yarn test
```

You can also run unittests and e2e tests separately with

- `yarn test:ut`
- `yarn test:e2e`

The test will run also on CI once you do your first commit.

### Coding style tests

Based on [TSLint](https://palantir.github.io/tslint/) - please refer to [tslint.json](tslint.json) for definition of the rules.
Violations will fail your builds.
Adding TSLint plugin to your IDE will spare you the trouble of fixing after the commit

## Deployment

Commit to master through a PR will bump the version, update docker hub with your image and deploy to Azure.
Commit to your branch will update to docker hub with custom tag, you will need to run the docker manually for now.

## Built With

- Nodejs
- Nest
- Graphql

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

Also this [git flow](https://guides.github.com/introduction/flow/)

## Versioning

We use [SemVer](http://semver.org/) for versioning.

## Authors

See also the list of [contributors](https://github.com/myspecialway/my-special-way-server/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- etc
