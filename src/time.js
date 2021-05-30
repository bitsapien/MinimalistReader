function timeSince (date) {
  const seconds = Math.floor((new Date() - date) / 1000)

  let interval = seconds / 31536000

  const getText = (diff, duration) =>
    Math.floor(diff) === 1 ? Math.floor(diff) + duration : Math.floor(diff) + duration + 's'

  if (interval > 1) {
    return getText(interval, ' year')
  }
  interval = seconds / 2592000
  if (interval > 1) {
    return getText(interval, ' month')
  }
  interval = seconds / 86400
  if (interval > 1) {
    return getText(interval, ' day')
  }
  interval = seconds / 3600
  if (interval > 1) {
    return getText(interval, ' hour')
  }
  interval = seconds / 60
  if (interval > 1) {
    return getText(interval, ' minute')
  }
  return getText(seconds, ' second')
}

export { timeSince }
