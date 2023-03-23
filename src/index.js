import { ContentScript } from 'cozy-clisk/dist/contentscript'

const baseUrl = 'about:blank'

class DummycliskContentScript extends ContentScript {
  async ensureAuthenticated() {
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
      <option>USER_ACTION_NEEDED</option> 
    </select> </p>
    <p><label for="timeout">Delay before exec (s):</label><br>
    <select id="timeout">
      <option>0</option>
      <option>5</option>
      <option>10</option>
      <option>20</option>
    </select> </p>
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
    return { event, timeout }
  }

  async fetch() {
    await this.goto(baseUrl)
    await this.runInWorker('printComboBox')
    await this.setWorkerState({ visible: true })
    const { event, timeout } = await this.runInWorker('waitForUserEntry')
    await this.setWorkerState({ visible: false })
    this.log('debug', `Status is a ${event} and Timeout is ${timeout}`)

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
