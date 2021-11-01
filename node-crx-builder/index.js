require('dotenv').config();
const {Builder, By, Key, until} = require('selenium-webdriver');

(async function example() {
    let driver = await new Builder()
        .forBrowser('chrome')
        .usingServer(process.env.SELENIUM_REMOTE_URL)
        .build();
    try {
        await driver.get('chrome://extensions');

        const devModeTumbler = await driver.executeScript(_getDevModeTumbler);
        await devModeTumbler.click();

        const packBtn = await driver.executeScript(_getPackBtn);
        await packBtn.click();

        const rootDirInput = await driver.executeScript(_getRootDirInput);
        await rootDirInput.click();

        await driver.switchTo().activeElement().sendKeys(process.env.EXTENSIONS_SRC + process.env.EXTENSION_NAME);

        const packActionBtn = await driver.executeScript(_getPackActionBtn);
        await packActionBtn.click();

        // @TODO wait until "Pack extension" dialog title is visible

        // await driver.findElement(By.id('devMode')).click();
        // Enter text "cheese" and perform keyboard action "Enter"
        // await driver.findElement(By.name('q')).sendKeys('cheese', Key.ENTER);

        // let firstResult = await driver.wait(until.elementLocated(By.css('h3')), 10000);

        // console.log(await firstResult.getAttribute('textContent'));
    }
    finally{
        await driver.quit();
    }

    function _getDevModeTumbler() {
        return _getExtensionsToolbarShadowRoot()
            .querySelector('#devMode');
    }

    function _getPackBtn() {
        return _getExtensionsToolbarShadowRoot()
            .querySelector('#packExtensions');
    }

    function _getRootDirInput() {
        return _getExtensionsPackDialogShadowRoot()
            .querySelector('#root-dir').shadowRoot
            .querySelector('#input');
    }

    function _getPackActionBtn() {
        return _getExtensionsPackDialogShadowRoot()
            .querySelector('.action-button');
    }

    function _getExtensionsToolbarShadowRoot() {
        return document.getElementsByTagName('extensions-manager')[0].shadowRoot
            .querySelector('extensions-toolbar').shadowRoot;
    }

    function _getExtensionsPackDialogShadowRoot() {
        return _getExtensionsToolbarShadowRoot()
            .querySelector('extensions-pack-dialog').shadowRoot;
    }
})();