const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  let notificationClass = ''
  if (type === 'success') {
    notificationClass = 'success'
  } else {
    notificationClass = 'error'
  }

  return (
    <div className={`notification ${notificationClass}`}>
      {message}
    </div>
  )
}

export default Notification