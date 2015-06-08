let events = [1, 2, 3, 4, 5]

// TODO: use parse.com as database
export default class {
  static getAllEvents() {
    return events
  }

  static addEvent(eventData) {
    events.push(eventData)
  }
}
