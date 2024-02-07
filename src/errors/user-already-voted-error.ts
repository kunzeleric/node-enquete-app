export class UserAlreadyVotedError extends Error {
  constructor() {
    super('You already voted on this poll')
  }
}