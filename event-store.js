let events = [1, 2, 3]

export default class {
  static getAllEvents() {
    return events
  }

  static addEvent(eventData) {
    events.push(eventData)
  }
}
