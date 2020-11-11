const collections = require('./models')
const connection = require('./connection')

const db = {
  connection
}

Object.keys(collections).forEach((collectionName) => {
  db[collectionName] = connection.model(collectionName, collections[collectionName])
})

db.User.getData = async (tgUser) => {
  let telegramId

  if (tgUser.chat_id) telegramId = tgUser.chat_id
  else telegramId = tgUser.id

  let user = await db.User.findOne({ chat_id: telegramId })

  if (!user) {
    user = new db.User()
    user.chat_id = tgUser.id
  }

  return user
}

db.User.updateData = async (tgUser) => {
  const user = await db.User.getData(tgUser)

  user.first_name = tgUser.first_name
  user.last_name = tgUser.last_name
  user.username = tgUser.username
  user.updatedAt = new Date()
  await user.save()

  return user
}


db.ChatUser.getData = async (tgUser) => {
  let telegramId

  if (tgUser.chat_id) telegramId = tgUser.chat_id
  else telegramId = tgUser.id

  let user = await db.ChatUser.findOne({ chat_id: telegramId })

  if (!user) {
    user = new db.ChatUser()
    user.chat_id = tgUser.id
  }

  return user
}

db.ChatUser.updateData = async (tgUser) => {
  const user = await db.ChatUser.getData(tgUser)

  user.first_name = tgUser.first_name
  user.last_name = tgUser.last_name
  user.username = tgUser.username
  user.updatedAt = new Date()
  await user.save()

  return user
}

module.exports = {
  db
}

