const { test, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Read script.js content
const scriptPath = path.resolve(__dirname, 'script.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

describe('Mobile Menu Toggle', () => {
    test('should toggle active class on nav-links when menu-btn is clicked', () => {
        const elements = {};
        const listeners = {};

        const mockDocument = {
            querySelector: (selector) => {
                if (!elements[selector]) {
                    const el = {
                        classList: {
                            toggle: (className) => {
                                if (!el._classes) el._classes = new Set();
                                if (el._classes.has(className)) {
                                    el._classes.delete(className);
                                } else {
                                    el._classes.add(className);
                                }
                            },
                            contains: (className) => el._classes && el._classes.has(className)
                        },
                        addEventListener: (event, callback) => {
                            if (!listeners[selector]) listeners[selector] = {};
                            listeners[selector][event] = callback;
                        },
                        _classes: new Set()
                    };
                    elements[selector] = el;
                }
                return elements[selector];
            },
            querySelectorAll: () => [],
            createElement: () => ({ setProperty: () => {}, appendChild: () => {}, style: {} }),
            head: { appendChild: () => {} },
            body: { classList: { add: () => {} }, appendChild: () => {} },
            addEventListener: () => {}
        };

        const context = {
            document: mockDocument,
            console: console,
            window: {
                addEventListener: () => {},
                dispatchEvent: () => {},
                innerWidth: 1024
            },
            getComputedStyle: () => ({ getPropertyValue: () => '' }),
            Image: function() { return {}; },
            setTimeout: setTimeout,
            setInterval: setInterval,
            clearInterval: clearInterval,
            requestAnimationFrame: (cb) => cb(),
            IntersectionObserver: function() {
                return { observe: () => {}, unobserve: () => {} };
            }
        };

        vm.createContext(context);
        vm.runInContext(scriptContent, context);

        const initMobileMenu = context.initMobileMenu;
        assert.strictEqual(typeof initMobileMenu, 'function', 'initMobileMenu should be a function');

        // Setup elements in mock
        const menuBtn = mockDocument.querySelector('.btn-menu');
        const navLinks = mockDocument.querySelector('.nav-links');

        // Initialize
        initMobileMenu();

        // Check if listener was added
        assert.strictEqual(typeof listeners['.btn-menu']['click'], 'function', 'Click listener should be registered');

        // Initial state
        assert.strictEqual(navLinks.classList.contains('active'), false, 'Initially should not be active');

        // Click 1
        listeners['.btn-menu']['click']();
        assert.strictEqual(navLinks.classList.contains('active'), true, 'Should be active after one click');

        // Click 2
        listeners['.btn-menu']['click']();
        assert.strictEqual(navLinks.classList.contains('active'), false, 'Should not be active after second click');
    });

    test('should handle missing elements gracefully', () => {
        const mockDocument = {
            querySelector: () => null,
            querySelectorAll: () => [],
            createElement: () => ({ setProperty: () => {}, appendChild: () => {}, style: {} }),
            head: { appendChild: () => {} },
            body: { classList: { add: () => {} }, appendChild: () => {} },
            addEventListener: () => {}
        };

        const context = {
            document: mockDocument,
            console: console,
            window: {
                addEventListener: () => {},
                dispatchEvent: () => {},
                innerWidth: 1024
            },
            getComputedStyle: () => ({ getPropertyValue: () => '' }),
            Image: function() { return {}; },
            setTimeout: setTimeout,
            setInterval: setInterval,
            clearInterval: clearInterval,
            requestAnimationFrame: (cb) => cb(),
            IntersectionObserver: function() {
                return { observe: () => {}, unobserve: () => {} };
            }
        };

        vm.createContext(context);
        vm.runInContext(scriptContent, context);

        const initMobileMenu = context.initMobileMenu;

        // This should not throw
        assert.doesNotThrow(() => initMobileMenu());
    });
});
