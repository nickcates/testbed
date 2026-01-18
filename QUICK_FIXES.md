# Quick Action Checklist

## Immediate Actions (Do Today - 30 minutes)

### Step 1: Remove Dangerous Packages
```bash
npm uninstall request jquery underscore validator debug
```

**Why:**
- `request` - Critical vulnerability, deprecated
- `jquery` - Not needed in Node.js backend
- `underscore` - Unused, redundant with lodash
- `validator` - Unused
- `debug` - Unused

### Step 2: Update Vulnerable Packages
```bash
npm install axios@latest lodash@4.17.21 express@4.22.1 moment@2.30.1
```

**Fixes:**
- axios: 3 high severity vulnerabilities
- lodash: 2 high severity vulnerabilities (command injection, ReDoS)
- express: Multiple vulnerabilities (XSS, open redirect)
- moment: 2 high severity vulnerabilities (path traversal, ReDoS)

### Step 3: Update Code
Edit `index.js` to remove unused imports:

```javascript
const express = require('express');
const moment = require('moment');
const lodash = require('lodash');
// REMOVED: const underscore = require('underscore');
// REMOVED: const request = require('request');
// REMOVED: const validator = require('validator');
const axios = require('axios');
const chalk = require('chalk');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  const data = lodash.map([1, 2, 3], n => n * 2);

  res.json({
    message: 'Hello World',
    timestamp: now,
    data: data
  });
});

app.listen(port, () => {
  console.log(chalk.green(`Server running on port ${port}`));
});
```

### Step 4: Verify
```bash
npm audit
npm test
npm start
```

**Expected Result:**
- Vulnerabilities reduced from 44 to ~10-15
- All critical and most high vulnerabilities resolved
- Application works correctly

---

## Next Steps (This Week - 2-4 hours)

### Update DevDependencies
```bash
npm install --save-dev jest@latest webpack@latest eslint@latest
```

### Migrate from Moment.js to date-fns
```bash
npm install date-fns
npm uninstall moment
```

Update code:
```javascript
const { format } = require('date-fns');
const now = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
```

### Replace Lodash with Native JS
```javascript
// Remove lodash entirely
const data = [1, 2, 3].map(n => n * 2);
```

---

## Metrics

### Before
- 44 vulnerabilities (3 critical, 14 high)
- 882 total packages
- 87 MB node_modules
- 2 deprecated packages

### After Quick Fixes
- ~10-15 vulnerabilities (0 critical, 0-2 high)
- ~700-800 total packages
- ~70 MB node_modules
- 0 deprecated packages in use

### After Complete Cleanup
- 0 vulnerabilities
- ~250-350 total packages
- ~35-45 MB node_modules
- Modern, maintained dependencies

---

## Prevention

### Add to package.json scripts:
```json
{
  "scripts": {
    "audit": "npm audit",
    "check": "npm audit && npm outdated"
  }
}
```

### Set up Dependabot
Create `.github/dependabot.yml` for automated updates

### Regular Schedule
- Run `npm audit` weekly
- Review `npm outdated` monthly
- Update dependencies quarterly
