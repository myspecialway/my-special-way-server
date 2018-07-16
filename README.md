[![Build Status](https://travis-ci.org/myspecialway/my-special-way-server.svg?branch=master)](https://travis-ci.org/myspecialway/my-special-way-server)
[![codecov](https://codecov.io/gh/myspecialway/my-special-way-server/branch/master/graph/badge.svg)](https://codecov.io/gh/myspecialway/my-special-way-server)
[![BCH compliance](https://bettercodehub.com/edge/badge/myspecialway/my-special-way-server?branch=master)](https://bettercodehub.com/results/myspecialway/my-special-way-server)
[![Known Vulnerabilities](https://snyk.io/test/github/myspecialway/my-special-way-server/badge.svg?targetFile=package.json)](https://snyk.io/test/github/myspecialway/my-special-way-server?targetFile=package.json)
# my-special-way-server

Server part of the My special way project enabling indoor navigation for schools

Demo master version running at _(link to be added here)_

## Table of Content
1. [Getting Started](#getting-started)
1. Contribution Guide
1. API Documentation
1. CI/CD

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See CI/CD for notes on how to deploy the project on a live system.

### Prerequisites
In this project we use various tools and technologies for development and deployment, to be able to work you will have to install the following: 

* [Nodejs](http://nodejs.org)
* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* yarn `npm i -g yarn`
* typescript `npm i -g typescript`

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

### Starting the server

```
yarn start
```

### Running the tests

The below will run both the Unit and the E2E tests

```
yarn test

```
You can also run unittests and e2e tests separately with
* `yarn test:ut`
* `yarn test:e2e`

The test will run also on CI once you do your first commit.

### Coding style tests

Based on [TSLint](https://palantir.github.io/tslint/) - please refer to [tslint.json](tslint.json) for definition of the rules.
Violations will fail your builds.
Adding TSLint plugin to your IDE will spare you the trouble of fixing after the commit

## Deployment

Commit to master through a PR will bump the version, update docker hub with your image and deploy to Azure.
Commit to your branch will update to docker hub with custom tag, you will need to run the docker manually for now.

## Built With

* Nodejs
* Nest
* Graphql

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

* Hat tip to anyone whose code was used
* Inspiration
* etc
