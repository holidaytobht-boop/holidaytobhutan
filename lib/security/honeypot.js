export function isHoneypotTriggered(body) {
  const value = body?._hp ?? body?.website
  return typeof value === 'string' && value.trim().length > 0
}

export function honeypotSuccessResponse(res) {
  return res.status(201).json({
    success: true,
    message: 'Thank you! Your message has been received.',
    data: { id: 'accepted', storage: 'filtered' },
  })
}
