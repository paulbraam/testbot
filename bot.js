const Telegraf = require('telegraf')
const Stage = require('telegraf/stage')
const session = require('telegraf/session')
const { db } = require('./database')
require('https').createServer().listen(process.env.PORT || 5000).on('request', function (req, res) { Res.end() })

const bot = new Telegraf(process.env.BOT_TOKEN)



// init bot



// error handling
bot.catch((error, ctx) => {
  console.error(`error for ${ctx.updateType}`, error)
})

// db connect
bot.context.db = db

// use session
bot.use(session({ ttl: 60 * 5 }))

// rate-limiting

/** Scene manager initialisation */
const stage = new Stage()
bot.use(stage.middleware())
bot.use((ctx, next) => {
  if (ctx.session.initialisation) return next()
  ctx.session.initialisation = true;
  return next()
})

// response time logger
bot.use(async (ctx, next) => {
  const ms = new Date()
  if (ctx.from) {
    if (!ctx.session.user) {
      console.log('new user')
      ctx.session.user = await db.User.updateData(ctx.from)
      ctx.session.user.blocked = false
      await ctx.session.user.save()
    } else {
      db.User.updateData(ctx.from).then((user) => {
        ctx.session.user = user
      })
    }
  }
  if (ctx.session.user && ctx.session.user.locale) ctx.i18n.locale(ctx.session.user.locale)
  if (ctx.callbackQuery) ctx.state.answerCbQuery = []
  return next(ctx).then(() => {
    if (ctx.callbackQuery) ctx.answerCbQuery(...ctx.state.answerCbQuery)
    console.log('Response time %sms', new Date() - ms)
  })
})



//scenes

const {
  readingScene,
  readingStart
} = require('./scenes')

stage.register(readingScene)


bot.hears('LV #1', ctx => readingStart(ctx, 1))



// functions


// error handling

bot.catch(err => {
  console.log(err)
})


// start bot
db.connection.once('open', async () => {
  console.log('Connected to MongoDB')
  if (process.env.BOT_DOMAIN) {
    bot.launch({
      webhook: {
        domain: process.env.BOT_DOMAIN,
        hookPath: `/wowbotty_bot:${process.env.BOT_TOKEN}`,
        port: process.env.WEBHOOK_PORT || 2500
      }
    }).then(() => {
      console.log('bot start webhook')
    })
  } else {
    bot.launch().then(() => {
      console.log('bot start polling')
    })
  }
})

