const fs = require('fs');
const path = require('path');
const login = require('./login');

function parseCsvLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let index = 0; index < line.length; index += 1) {
        const char = line[index];

        if (char === '"') {
            inQuotes = !inQuotes;
            continue;
        }

        if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
            continue;
        }

        current += char;
    }

    values.push(current);
    return values.map((value) => value.trim());
}

function loadTestCases() {
    const filePath = path.join(__dirname, 'testCases.txt');
    const raw = fs.readFileSync(filePath, 'utf8');

    function expectedFor(username, password) {
        if (username === '' && password === '') {
            return 'Required UserName and password Fields';
        }
        if (username === '') {
            return 'Empty UserName Fields';
        }
        if (password === '') {
            return 'Empty Password Fields';
        }
        if (username === 'admin' && password === '1234') {
            return 'Login Successful';
        }
        return 'Invalid Credentials';
    }

    return raw
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line) => {
            const [username = '', password = '', expected = ''] = parseCsvLine(line);
            const finalExpected = expected === '' ? expectedFor(username, password) : expected;
            return { username, password, expected: finalExpected };
        });
}

describe('login() from testCases.txt', () => {
    const cases = loadTestCases();

    test('testCases.txt has at least 1 case', () => {
        expect(cases.length).toBeGreaterThan(0);
    });

    test.each(cases)('$username / $password => $expected', ({ username, password, expected }) => {
        expect(expected).not.toBe('');
        expect(login(username, password)).toBe(expected);
    });
});