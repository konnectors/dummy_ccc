import { ContentScript } from 'cozy-clisk/dist/contentscript'

const baseUrl = 'about:blank'

class DummycliskContentScript extends ContentScript {
  async ensureAuthenticated() {
    this.log('debug', 'Debug level, Starting ensureAuthenticated')
    this.log('info', 'Info level, Starting ensureAuthenticated')
    this.log('warn', 'Warn level, Starting ensureAuthenticated')
    this.log('error', 'Error level, Starting ensureAuthenticated')
    return true
  }

  printComboBox() {
    // Possible CSS tested
    // const box = `<div style="font-size: 50px">  // no stretch of dropdown, less nice
    const html = `<div style="text-align: center;transform: scale(5) translateY(50%)">
    <p>Dummyclisk konnector </p>
    <p><label for="event">Event to simulate:</label><br>
    <select id="event">
      <option>SUCCESS</option>
      <option>VENDOR_DOWN</option>
      <option>UNKNOWN_ERROR</option>
      <option>UNKNOWN_ERROR.PARTIAL_SYNC</option>
      <option>USER_ACTION_NEEDED</option>
    </select> </p>
    <p><label for="timeout">Delay before exec (s):</label><br>
    <select id="timeout">
      <option>0</option>
      <option>5</option>
      <option>10</option>
      <option>20</option>
      <option>3600</option>
    </select> </p>
    <p><label for="url">Go to url</label><br>
    <input id="url" type="text" value=""></p>
    <p><input type="submit" value="Launch" class="button"></p>
    <p id="validation" hidden>Launching</p>
    </div>
    `
    document.body.innerHTML = html
  }

  async waitForUserEntry() {
    return await new Promise(resolve => {
      const button = document.querySelector('.button')
      button.addEventListener('click', () => {
        resolve(this.extractData())
      })
    })
  }

  extractData() {
    document.getElementById('validation').hidden = false
    const timeout = document.querySelector('#timeout').value
    const event = document.querySelector('#event').value
    const url = document.querySelector('#url').value
    return { event, timeout, url }
  }

  async getUserDataFromWebsite() {
    this.log('info', '🤖 getUserDataFromWebsite')
    return {
      sourceAccountIdentifier: 'defaultDummyCliskAccountIdentifier'
    }
  }

  async fetch() {
    this.log('debug', 'Debug level, Starting fetch')
    this.log('info', 'Info level, Starting fetch')
    this.log('warn', 'Warn level, Starting fetch')
    this.log('error', 'Error level, Starting fetch')
    await this.goto(baseUrl)
    await this.runInWorker('printComboBox')
    await this.setWorkerState({ visible: true })
    const { event, timeout, url } = await this.runInWorker('waitForUserEntry')

    if (url.length > 0) {
      await this.goto(url)
    } else {
      await this.setWorkerState({ visible: false })
    }
    this.log(
      'debug',
      `Status is a ${event} and Timeout is ${timeout} and url is ${url}`
    )

    const timeoutInMs = parseInt(timeout) * 1000
    if (Number.isInteger(parseInt(timeout)) && timeoutInMs !== 0) {
      this.log('info', `Dummy is waiting for ${timeout} seconds`)
      await new Promise(resolve => setTimeout(resolve, timeoutInMs))
    }

    if (event != 'SUCCESS') {
      this.log('info', `Dummy simulating ${event}`)
      throw new Error(event)
    }
    this.log('info', 'Dummy simulating SUCCESS')
  }
}

const connector = new DummycliskContentScript()
connector
  .init({
    additionalExposedMethodsNames: ['printComboBox', 'waitForUserEntry']
  })
  .catch(err => {
    this.log('warn', err)
  })
