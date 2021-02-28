module.exports = {
    preset: 'jest-puppeteer',
    testRegex: './*\\.tests\\.js$',
    setupFilesAfterEnv: ['./setupTests.js']
};
