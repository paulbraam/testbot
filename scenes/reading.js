const WizardScene = require('telegraf/scenes/wizard')
const {defaultKeyboard, whileTestKeyboard} = require('../keyboards')
const { db } = require('../database')
const Markup = require('telegraf/markup')

const testName = 'read'
const { readQuestions } = require('../contents/reading')
let arr = []
let id = arr[0]
const questions = readQuestions()[id]

const readingStart = async ctx => {
  ctx.deleteMessage()
  ctx.session.answers = []
  await ctx.reply('Начнем тест...', whileTestKeyboard).catch(() => blocked(ctx))
  ctx.scene.enter('read')
  arr.push(id)
}


const testEnd = async ctx => {
  let user = await db.User.findOne({chat_id: ctx.from.id})
  let answers = ctx.session.answers
  let flatArr = answers.flat(1)
  let allAnswers = []
  for (var n = 0; n < flatArr.length; n++) {
      allAnswers.push(flatArr[n].key)
  }

  let keysArr = questions.map(x => x.key)
  let allKeys = [].concat.apply([], keysArr)
  let result = allAnswers.map((item, i) => item == allKeys[i])
  let correct = result.filter(Boolean).length
  let all = allKeys.length
  let percent = (correct / all * 100).toFixed()

  let today = (new Date()).toISOString().substring(0, 10)
  user.tests.push({
    name: testName,
    result: `${(correct / all * 100).toFixed()}%`,
    date: today,
    total: `\xa0'${testName}' ${(correct / all * 100).toFixed()}% (${today})`
  })
  await user.save()

  await ctx.reply(
    `Тест завершён. Твой результат:\n` +
    `Верно: ${' '.repeat(12)} ${correct} из ${all} (${(correct / all * 100).toFixed()}%)\n`, {
      reply_markup: {
        inline_keyboard: [
          [ 
            {text: 'Ответы', url: 'https://telegra.ph/Hello-10-24-13'}
          ]
        ]
      }
    })
  await ctx.scene.leave()

  if (percent >= 80) {
    await ctx.reply( `Отличный результат! 👍🏻\n`, defaultKeyboard).catch(() => blocked(ctx))
  } else {
    await ctx.reply(`К сожалению, это не лучший результат 😔\n`, defaultKeyboard).catch(() => blocked(ctx))
  }
};

const steps = questions.reduce((acc, el, i) => {
  acc.push(
    async ctx => {
        ctx.session.answers.push([
        { yes : ' ', no : ' ', idk : ' ', key : '0' },
        { yes : ' ', no : ' ', idk : ' ', key : '0' },
        { yes : ' ', no : ' ', idk : ' ', key : '0' },
        { yes : ' ', no : ' ', idk : ' ', key : '0' },
        { yes : ' ', no : ' ', idk : ' ', key : '0' }
      ])
      let answers = ctx.session.answers[i]
      await ctx.replyWithHTML(
        `<strong>Вопрос ${i + 1} из ${questions.length}:</strong>\n` +
        `${el.question}`, {
            reply_markup: Markup.inlineKeyboard([
                [
                  Markup.callbackButton(' ', '0'),
                  Markup.callbackButton('Ja', `0:1`),
                  Markup.callbackButton('Nein', `0:2`),
                  Markup.callbackButton('TSDN', `0:3`)
                ],
                [
                  Markup.callbackButton('#1', '0'),
                  Markup.callbackButton(answers[0].yes, `0:1`),
                  Markup.callbackButton(answers[0].no, `0:2`),
                  Markup.callbackButton(answers[0].idk, `0:3`)
                ],
                [
                  Markup.callbackButton('#2', '0'),
                  Markup.callbackButton(answers[1].yes, `1:1`),
                  Markup.callbackButton(answers[1].no, `1:2`),
                  Markup.callbackButton(answers[1].idk, `1:3`)
                ],
                [
                  Markup.callbackButton('#3', `0`),
                  Markup.callbackButton(answers[2].yes, `2:1`),
                  Markup.callbackButton(answers[2].no, `2:2`),
                  Markup.callbackButton(answers[2].idk, `2:3`)
                ],
                [
                  Markup.callbackButton('#4', '0'),
                  Markup.callbackButton(answers[3].yes, `3:1`),
                  Markup.callbackButton(answers[3].no, `3:2`),
                  Markup.callbackButton(answers[3].idk, `3:3`)
                ],
                [
                  Markup.callbackButton('#5', '0'),
                  Markup.callbackButton(answers[4].yes, `4:1`),
                  Markup.callbackButton(answers[4].no, `4:2`),
                  Markup.callbackButton(answers[4].idk, `4:3`)
                ],
                [
                  Markup.callbackButton('Submit', 'submit')
                ]
              ])
        }
      ).catch(() => blocked(ctx))
      return ctx.wizard.next()
    }
  )
  acc.push(
    async ctx => {
      let answers = ctx.session.answers[i]
      if (ctx.update.callback_query) {
        switch (ctx.update.callback_query.data) {
            case (ctx.update.callback_query.data.match(/^([0-4]):([0-3])$/) || {}).input:
                await ctx.answerCbQuery()
                let row = ctx.update.callback_query.data.split(':')[0]
                let answer = ctx.update.callback_query.data.split(':')[1]
                switch (answer) {
                    case '1':
                        if (answers[row].yes !== '✅') {
                            answers[row].yes = '✅'
                            answers[row].no = ' '
                            answers[row].idk = ' '
                            answers[row].key = '1'
                        } else {
                            answers[row].yes = ' '
                            answers[row].key = '0'
                        }
                        break
                    case '2':
                        if (answers[row].no !== '✅') {
                            answers[row].yes = ' '
                            answers[row].no = '✅'
                            answers[row].idk = ' '
                            answers[row].key = '2'
                        } else {
                            answers[row].no = ' '
                            answers[row].key = '0'
                        }
                        break
                    case '3':
                        if (answers[row].idk !== '✅') {
                            answers[row].yes = ' '
                            answers[row].no = ' '
                            answers[row].idk = '✅'
                            answers[row].key = '3'
                        } else {
                            answers[row].idk = ' '
                            answers[row].key = '0'
                        }
                        break 
                }
                
                await ctx.editMessageReplyMarkup(Markup.inlineKeyboard([
                        [
                          Markup.callbackButton(' ', '0'),
                          Markup.callbackButton('Ja', `0`),
                          Markup.callbackButton('Nein', `0`),
                          Markup.callbackButton('TSDN', `0`)
                        ],
                        [
                          Markup.callbackButton('#1', '0'),
                          Markup.callbackButton(answers[0].yes, `0:1`),
                          Markup.callbackButton(answers[0].no, `0:2`),
                          Markup.callbackButton(answers[0].idk, `0:3`)
                        ],
                        [
                          Markup.callbackButton('#2', '0'),
                          Markup.callbackButton(answers[1].yes, `1:1`),
                          Markup.callbackButton(answers[1].no, `1:2`),
                          Markup.callbackButton(answers[1].idk, `1:3`)
                        ],
                        [
                          Markup.callbackButton('#3', `0`),
                          Markup.callbackButton(answers[2].yes, `2:1`),
                          Markup.callbackButton(answers[2].no, `2:2`),
                          Markup.callbackButton(answers[2].idk, `2:3`)
                        ],
                        [
                          Markup.callbackButton('#4', '0'),
                          Markup.callbackButton(answers[3].yes, `3:1`),
                          Markup.callbackButton(answers[3].no, `3:2`),
                          Markup.callbackButton(answers[3].idk, `3:3`)
                        ],
                        [
                          Markup.callbackButton('#5', '0'),
                          Markup.callbackButton(answers[4].yes, `4:1`),
                          Markup.callbackButton(answers[4].no, `4:2`),
                          Markup.callbackButton(answers[4].idk, `4:3`)
                        ],
                        [
                          Markup.callbackButton('Submit', 'submit')
                        ]
                      ]))
                break
            case 'submit':
                let keys = answers.filter(x => x.key == '0')
                if (keys.length == 0) {
                    
                    await ctx.editMessageText(questions[i].question)

                    await ctx.deleteMessage()

                    ctx.wizard.next()
                    ctx.wizard.steps[ctx.wizard.cursor](ctx)
                } else {
                    await ctx.answerCbQuery('Проверьте правильность данных')
                }
                break
            default: 
        }
      } else if (ctx.message.text) {
        if (ctx.message.text == '❗️ Завершить') {
            await ctx.reply(
                `Вы завершили тест\n`, defaultKeyboard)
            await ctx.scene.leave()
        }
      }
    }
  )

  return acc;
}, [])

steps.push(ctx => testEnd(ctx))

const readingScene = new WizardScene('read', ...steps)

async function blocked (ctx) {
    console.log(`Failed sending at:`, ctx.chat.id)
    const user = await db.User.findOne({chat_id: ctx.chat.id})
    user.blocked = true
    await user.save()
  }

module.exports = {readingScene, readingStart}