# Poll Voting API

This is an API was developed during Rocketseat's event NLW Experts.
It is a voting poll application, where the user can create a voting poll, vote on it and see voting situation in real time using websockets.

## Functionalities

- User can register a voting poll with title and options
- User can choose an option to vote in an informed poll
- User can fetch poll information
- User can check voting situation in real time

## Technologies

- Node.js (with TS)
- Prisma
- PostgreSQL
- Redis
- Websocket (the highlight for me)

## Installing the Project

```
git clone *projet-url*

cd *projects-directory*

npm install
```

## Load Docker Image (PostgreSQL \ Redis)

*Reminder: Docker software must be installed previously.

```
docker compose up -d
```

## Rules\Restrictions

- [x] The user should not be able to vote twice in the same poll
- [x] The user could change his vote option in the same poll previously voted

## Routes

#### Register Poll

```http
  POST /polls
```

| Body Data   | Type       | Description                           |
| :---------- | :--------- | :---------------------------------- |
| `title` | `string` | **Mandatory**. Poll title. |
| `options` | `Array[string]` | **Mandatory**. Poll voting options. |


#### Get Poll Information

```http
  GET /polls/:pollId
```

| Param   | Type       | Description                           |
| :---------- | :--------- | :---------------------------------- |
| `pollId` | `string` | **Mandatory**. Poll ID desired to seek information. |


#### Vote on A Poll

```http
  POST /polls/:pollId/vote
```

| Param   | Type       | Description                           |
| :---------- | :--------- | :---------------------------------- |
| `pollId` | `string` | **Mandatory**. Poll ID desired to seek information. |

| Body Data   | Type       | Description                           |
| :---------- | :--------- | :---------------------------------- |
| `pollOptionId` | `string` | **Mandatory**. Option ID chosen to vote in the poll. |

#### Websocket Route - Listening to Poll Votes Events

*Route used in Postman to test its functionality*
```
  GET ws://localhost:PORT/polls/pollId/results
```

## Take Aways

- Prisma functionalities (createMany)
- Websocket Protocol
- Redis Database
