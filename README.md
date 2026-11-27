# JavaScript CWE89-01 Test Case with 25,500 Files

## Purpose
This test case validates the benchmark's ability to handle projects that exceed file count limits. It contains:
- **25,500 plain JavaScript utility files** (no security flaws)
- **1 main.js file** with CWE89-01 SQL injection vulnerability

## Structure.
```
javascript-cwe89-01-25k/
├── main.js              # Contains CWE89-01 SQL Injection vulnerability
├── package.json         # Node.js package metadata
├── lib/                 # Directory containing 25,500 plain utility files
│   ├── utility_1.js
│   ├── utility_2.js
│   ├── ...
│   └── utility_25500.js
└── README.md            # This file
```

## Vulnerability Details

### CWE89-01: SQL Injection
**Location**: `main.js` (lines 25-26)
```javascript
const [results] = await sequelize.query(
  `SELECT id, username, email, created_at FROM users WHERE username = '${username}'`
);
```

**Risk**: User input is directly interpolated into SQL query without parameterization.

**Expected Fix**: Use parameterized queries:
```javascript
const [results] = await sequelize.query(
  'SELECT id, username, email, created_at FROM users WHERE username = ?',
  { replacements: [username] }
);
```

## File Count
- **Total Files**: 25,502 (25,500 utilities + main.js + package.json)
- **Plain Utility Files**: 25,500 (located in `lib/`)
- **Files with Vulnerabilities**: 1 (main.js)

## Plain File Characteristics
Each utility file in `lib/` is syntactically valid JavaScript:
- No import/export beyond module.exports
- No external dependencies
- No security vulnerabilities
- Minimal code (< 200 bytes per file)

Example utility file structure:
```javascript
// Plain utility file - no security flaws
function utility{num}() {
  const value = "plain_file_{num}";
  return value;
}

module.exports = { utility{num} };
```

## Testing with Benchmark

### Command
```bash
cd autofix-benchmark
python run_benchmark.py --test-case javascript-cwe89-01-25k --verbose
```

### Expected Behavior

1. **Compiler Check**: ✓ PASS
   - All 25,502 files are syntactically valid JavaScript
   - No compilation errors

2. **Autopackager**: ✓ PASS
   - File count check passes (25,502 ≤ 30,000 limit)
   - Package created successfully

3. **Pipeline Scan**: Should detect CWE89-01
   - Expected: 1 SQL injection finding in main.js
   - Severity: Medium/High
   - File: main.js, Line: 26

## Limits & Constraints

- **File Limit**: 30,000 files (product limit for optimal performance)
- **Veracode Limitation**: Currently 25,000 files is the published limit
- **Benchmark Support**: Extended to 30,000 to allow testing of large projects

## Future Enhancements

- [ ] Smart filtering of dependency folders (node_modules, dist, etc.)
- [ ] Automatic .veracodeexclude generation
- [ ] File count analysis and reporting
- [ ] Split-scan for projects exceeding limits

## Generation Script

This test case was generated using `generate_25k_js_files.py`:
```bash
python generate_25k_js_files.py
```

The script creates 25,500 individual utility files to simulate a large project with many dependencies or generated files.

## Notes for Development Teams

- This test case mimics real-world scenarios where projects have many auto-generated or vendor files
- The 25,500 utility files can be easily filtered using `.veracodeexclude`
- Recommended approach: Exclude `lib/` folder and scan only `main.js` for demonstration

---

**Created**: 2026-11-16  
**Test Case Type**: File Limit Validation  
**Vulnerability Count**: 1 (CWE89-01)  
**Total Files**: 25,502
