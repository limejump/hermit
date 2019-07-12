## Description

A [Nest](https://github.com/nestjs/nest) framework microservice to proxy logs from
client side applications to Humio.

It provides three endpoints:

* `/v1/structured` - logs [structured](https://docs.humio.com/api/ingest-api/#structured-data)
    logs to Humio
* `/v1/unstructured` - logs [unstructured](https://docs.humio.com/api/ingest-api/#parser)
    logs to Humio - note these logs will require a parser to be configured
* `/v1/ready` - returns `200` if the microservice is online

All endpoints except `/v1/ready` require an authorization key to be sent in the header.

### Example Query

```curl
curl --request POST \
  --url http://localhost:3000/v1/structured \
  --header 'authorization: Bearer MY_AUTHORIZATION_KEY' \
  --header 'content-type: application/json' \
  --data '[
  {
    "tags": {
      "source": "application.log"
    },
    "events": [
      {
        "timestamp": "2018-06-06T13:00:00+02:00",
        "attributes": {
          "hello": "world"
        }
      },
      {
        "timestamp": "2018-06-06T13:00:01+02:00",
        "attributes": {
          "statuscode": "200",
          "url": "/index.html"
        }
      }
    ]
  },
  {
    "tags": {
      "source": "application.log"
    },
    "events": [
      {
        "timestamp": "2018-06-06T13:00:02+02:00",
        "attributes": {
          "key1": "value1"
        }
      }
    ]
  }
]'
```

## Configuration

The application requires two secret environment variables to be set. Examples of these
(with insecure values!) can be found in `.env.example`. During local development a
`.env` file can be used and authorization is disabled. For production these values are
_required_ to be set and a `.env` file cannot be used.

* `AUTHORIZATION_KEY`, the key to be used in the Authorization header. Is okay to be
    exposed to the client. Easily rotated.
* `DEFAULT_INGEST_TOKEN`, the ingest token for the
    [Humio repository](https://docs.humio.com/concepts/repositories/) you wish to log to.
    More details about ingest tokens
    [can be found here](https://docs.humio.com/sending-data-to-humio/ingest-tokens/).
* `WHITELIST_CORS`, a comma separated set of regex or strings that are the domains that should be allowed to make CORS requests

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Deploying using Docker

We have [Google Cloud Build](https://cloud.google.com/cloud-build/) set up to build the
Docker image on push to master. Currently we just publish a single Docker tag. An issue
has been opened [here](https://github.com/limejump/hermit/issues/11) to implement
versioning (including version tagged Docker images).

The latest master branch build is available at `gcr.io/limejump-public/hermit:latest`.
