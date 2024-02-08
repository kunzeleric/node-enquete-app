export class PollNotFoundError extends Error {
  constructor() {
    super('Poll informed does not exist')
  }
}