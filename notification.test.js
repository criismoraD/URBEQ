const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const scriptPath = path.resolve(__dirname, 'script.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

describe('showNotification', () => {
    let context;
    let mockDocument;
    let bodyChildren = [];
    let timeouts = [];

    beforeEach(() => {
        bodyChildren = [];
        timeouts = [];

        mockDocument = {
            createElement: (tagName) => {
                if (tagName === 'style') {
                    return { setProperty: () => {}, appendChild: () => {}, style: {} };
                }
                const el = {
                    tagName: tagName.toUpperCase(),
                    textContent: '',
                    style: {
                        cssText: ''
                    },
                    remove: function() {
                        const index = bodyChildren.indexOf(this);
                        if (index > -1) {
                            bodyChildren.splice(index, 1);
                        }
                    }
                };
                return el;
            },
            body: {
                appendChild: (child) => {
                    bodyChildren.push(child);
                }
            },
            head: {
                appendChild: () => {}
            },
            querySelector: () => null,
            querySelectorAll: () => [],
            addEventListener: () => {}
        };

        context = {
            document: mockDocument,
            console: console,
            window: {
                addEventListener: () => {},
                dispatchEvent: () => {},
                innerWidth: 1024
            },
            getComputedStyle: () => ({ getPropertyValue: () => '' }),
            Image: function() { return {}; },
            setTimeout: (callback, delay) => {
                timeouts.push({ callback, delay });
            },
            setInterval: setInterval,
            clearInterval: clearInterval,
            requestAnimationFrame: (cb) => cb(),
            IntersectionObserver: function() {
                return { observe: () => {}, unobserve: () => {} };
            }
        };

        vm.createContext(context);
        vm.runInContext(scriptContent, context);
    });

    test('should create and display a notification with the correct message', () => {
        const { showNotification } = context;
        const testMessage = 'Test Notification';

        showNotification(testMessage);

        assert.strictEqual(bodyChildren.length, 1, 'Notification should be added to body');
        assert.strictEqual(bodyChildren[0].textContent, testMessage, 'Notification should have correct message');
        assert.strictEqual(bodyChildren[0].tagName, 'DIV', 'Notification should be a div element');
    });

    test('should be removed after timeouts', () => {
        const { showNotification } = context;
        showNotification('Test removal');

        assert.strictEqual(bodyChildren.length, 1, 'Initially notification should be present');
        assert.strictEqual(timeouts.length, 1, 'First setTimeout should be registered');
        assert.strictEqual(timeouts[0].delay, 3000, 'First timeout should be 3000ms');

        // Execute first timeout (slideOut animation)
        timeouts[0].callback();

        assert.strictEqual(bodyChildren[0].style.animation, 'slideOut 0.3s ease', 'Slide out animation should be applied');
        assert.strictEqual(timeouts.length, 2, 'Second setTimeout should be registered');
        assert.strictEqual(timeouts[1].delay, 300, 'Second timeout should be 300ms');

        // Execute second timeout (removal)
        timeouts[1].callback();

        assert.strictEqual(bodyChildren.length, 0, 'Notification should be removed from body');
    });
});
