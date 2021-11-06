require('dotenv').config();
const {Builder, By, Key, until} = require('selenium-webdriver');

(async function example() {
    console.log('CRX Builder started');
    let driver = await new Builder()
        .forBrowser('chrome')
        .usingServer(process.env.SELENIUM_REMOTE_URL)
        .build();
    try {
        console.log('Getting chrome://extensions page...');
        await driver.get('chrome://extensions');

        await driver.executeScript(initContext);

        console.log('Enabling dev mode...');
        const devModeTumbler = await driver.executeScript(_getDevModeTumbler);
        await devModeTumbler.click();
        console.log('Waiting for dev mode')
        await driver.wait(until.elementLocated(By.js(() => {
            console.log("here");
            let el = window._getExtensionsToolbarShadowRoot().querySelector('#packExtensions');
            console.log(el);
            return el;
        })), 1000);
        await driver.manage().setTimeouts( { implicit: 1000 } );

        console.log('Opening packing menu...');
        const packBtn = await driver.executeScript(_getPackBtn);
        await packBtn.click();
        console.log('Waiting for packing menu dialog')
        // await driver.wait(until.elementLocated(By.js(() => {
        //     return window._getExtensionsPackDialogShadowRoot().querySelector('cr-dialog');
        // })), 100);

        console.log('Setting extension directory...');
        const rootDirInput = await driver.executeScript(_getRootDirInput);
        await rootDirInput.click();
        await driver.switchTo().activeElement().sendKeys(process.env.EXTENSIONS_SRC + process.env.EXTENSION_NAME);

        console.log('Packaging...');
        const packActionBtn = await driver.executeScript(_getPackActionBtn);
        await packActionBtn.click();
        console.log('Packaging finished successfully!');
        // @TODO wait until "Pack extension" dialog title is visible

        // await driver.findElement(By.id('devMode')).click();
        // Enter text "cheese" and perform keyboard action "Enter"
        // await driver.findElement(By.name('q')).sendKeys('cheese', Key.ENTER);

        // let firstResult = await driver.wait(until.elementLocated(By.css('h3')), 10000);

        // console.log(await firstResult.getAttribute('textContent'));
    } catch (e) {
        console.log('Could not build crx', e);
    } finally{
        await driver.quit();
        console.log('Building process was finished!');
    }

    function initContext() {
        window._getExtensionsToolbarShadowRoot = function() {
            return document.getElementsByTagName('extensions-manager')[0].shadowRoot
                .querySelector('extensions-toolbar').shadowRoot;
        }

        window._getExtensionsPackDialogShadowRoot = function() {
            return window._getExtensionsToolbarShadowRoot()
                .querySelector('extensions-pack-dialog').shadowRoot;
        }
    }

    function _getDevModeTumbler() {
        return window._getExtensionsToolbarShadowRoot()
            .querySelector('#devMode');
    }

    function _getPackBtn() {
        return window._getExtensionsToolbarShadowRoot()
            .querySelector('#packExtensions');
    }

    function _getRootDirInput() {
        return window._getExtensionsPackDialogShadowRoot()
            .querySelector('#root-dir').shadowRoot
            .querySelector('#input');
    }

    function _getPackActionBtn() {
        return window._getExtensionsPackDialogShadowRoot()
            .querySelector('.action-button');
    }
})();