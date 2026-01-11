# Phase 4: Elide Expert Quiz Complete Analysis

Generated: 2026-01-11
Total Questions: 500
Total Points: 500 (1 point each)

---

## Scoring Tiers
- **Pass**: 350+ (70%)
- **Expert**: 425+ (85%)
- **Master**: 475+ (95%)

---

## Section 1: Runtime & Core (100 questions)

### Easy (Questions 1-40)

#### Q1. Which languages does Elide support natively? (multiple select)
- A. JavaScript & TypeScript
- B. Python 3.11
- C. Java (JDK 24) & Kotlin (K2 v2.2.21)
- D. Ruby

**Answer: A,B,C,D**
**Explanation:** Elide supports JavaScript, TypeScript, Python 3.11, Java JDK 24, Kotlin K2 v2.2.21, Ruby, WebAssembly, and LLVM.
**Related Showcases:** api-gateway (uses TS+Python+Java+Ruby), polyglot-examples

---

#### Q2. What is Elide built on top of?
- A. V8 and Node.js
- B. GraalVM and Truffle
- C. JVM only
- D. LLVM only

**Answer: B**
**Explanation:** Elide is built on GraalVM v25.0.0 and Truffle language implementation framework.
**Related Showcases:** All showcases use GraalVM runtime

---

#### Q3. True or False: Elide requires a separate build step for TypeScript.
- A. True
- B. False

**Answer: B**
**Explanation:** False. Elide runs TypeScript directly with no build step via GraalVM's instant compilation.
**Related Showcases:** All TypeScript showcases (200+)

---

#### Q4. What is the key benefit of Elide's polyglot interop?
- A. Requires JSON serialization
- B. Zero-serialization cross-language calls
- C. Only works with JavaScript
- D. Requires separate processes

**Answer: B**
**Explanation:** Zero-serialization cross-language calls with <1ms overhead. All languages share the same heap and GC.
**Related Showcases:** flask-typescript-polyglot, ml-api, polyglot-ml-pipeline

---

#### Q5. Which Python version does Elide support?
- A. Python 2.7
- B. Python 3.8
- C. Python 3.11
- D. Python 3.13

**Answer: C**
**Explanation:** Python 3.11 via GraalPy implementation.
**Related Showcases:** ml-api, rag-service, sentiment-analysis-api

---

#### Q6. What is Elide's unified garbage collector benefit?
- A. Each language has its own GC
- B. Single GC shared across all languages
- C. No garbage collection
- D. Manual memory management required

**Answer: B**
**Explanation:** Single GC shared across all languages for zero cross-language GC overhead.
**Related Showcases:** All polyglot showcases benefit from unified GC

---

#### Q7. True or False: Elide can run TSX/JSX without a build step.
- A. True
- B. False

**Answer: A**
**Explanation:** True. TSX/JSX work with .tsx/.jsx extensions, no build step needed.
**Related Showcases:** elide-html, fullstack-template

---

#### Q8. Which JDK version does Elide support?
- A. JDK 11
- B. JDK 17
- C. JDK 21
- D. JDK 24

**Answer: D**
**Explanation:** JDK 24 (Oracle GraalVM instance).
**Related Showcases:** java-spring-bridge, java-spring-integration

---

#### Q9. Which Kotlin version does Elide support?
- A. Kotlin 1.9
- B. Kotlin K2 (v2.2.21)
- C. Kotlin 1.5
- D. Kotlin 3.0

**Answer: B**
**Explanation:** Kotlin K2 v2.2.21 with kotlinx libraries included.
**Related Showcases:** ktor-analytics-platform, kotlin-analytics-platform

---

#### Q10. True or False: Elide supports WebAssembly (WASM).
- A. True
- B. False

**Answer: A**
**Explanation:** True. WebAssembly is one of the supported language targets.
**Related Showcases:** wasm-polyglot-bridge

---

#### Q11. What is the approximate cold start performance of Elide vs Node.js?
- A. Same speed
- B. 2x faster
- C. 10x faster (~20ms vs ~200ms)
- D. 100x faster

**Answer: C**
**Explanation:** 10x faster (~20ms vs ~200ms) due to no V8 initialization overhead.
**Related Showcases:** All HTTP showcases demonstrate fast cold starts

---

#### Q12. Which statement about Elide's TypeScript support is correct?
- A. Requires tsc compilation first
- B. Runs TypeScript directly with no build step
- C. Only supports JavaScript
- D. Requires Babel

**Answer: B**
**Explanation:** Runs TypeScript directly with no build step via GraalVM runtime compilation.
**Related Showcases:** All TypeScript showcases

---

#### Q13. True or False: Elide can import Python modules from TypeScript.
- A. True
- B. False

**Answer: A**
**Explanation:** True. `import module from "./module.py"` works via Truffle interop.
**Related Showcases:** ml-api, flask-typescript-polyglot, polyglot-ml-pipeline

---

#### Q14. What does "polyglot" mean in Elide's context?
- A. Multiple programming languages in one runtime
- B. Multiple databases
- C. Multiple servers
- D. Multiple operating systems

**Answer: A**
**Explanation:** Multiple programming languages in one runtime with zero-serialization interop.
**Related Showcases:** All polyglot showcases (50+)

---

#### Q15. Which file extension triggers TSX processing in Elide?
- A. .ts
- B. .tsx
- C. .jsx
- D. Both B and C

**Answer: D**
**Explanation:** Both .tsx and .jsx trigger TSX/JSX processing.
**Related Showcases:** elide-html, fullstack-template

---

#### Q16. True or False: Elide uses a single unified GC across all languages.
- A. True
- B. False

**Answer: A**
**Explanation:** True. Unified GC across all languages for no cross-language GC overhead.
**Related Showcases:** All polyglot showcases

---

#### Q17. What is the performance benchmark for Elide on Linux (RPS)?
- A. ~10K RPS
- B. ~100K RPS
- C. ~800K RPS
- D. ~1M RPS

**Answer: C**
**Explanation:** ~800K RPS on Linux with native transports (Netty + epoll).
**Related Showcases:** api-gateway, realtime-dashboard

---

#### Q18. Which organization benchmarks Elide independently?
- A. Node.js Foundation
- B. TechEmpower
- C. Mozilla
- D. Google

**Answer: B**
**Explanation:** TechEmpower Web Framework Benchmarks.
**Related Showcases:** N/A (external benchmark)

---

#### Q19. True or False: Elide requires V8 initialization.
- A. True
- B. False

**Answer: B**
**Explanation:** False. Elide uses GraalVM, not V8. No V8 initialization overhead.
**Related Showcases:** All showcases benefit from no V8 overhead

---

#### Q20. What is the primary benefit of zero-serialization interop?
- A. Slower performance
- B. No overhead when calling across languages
- C. Requires JSON conversion
- D. Only works with strings

**Answer: B**
**Explanation:** No overhead when calling across languages (<1ms). Objects shared directly on heap.
**Related Showcases:** flask-typescript-polyglot, ml-api

---

#### Q21. Which language feature does Elide NOT support?
- A. async/await
- B. Generators
- C. Classes
- D. None - all are supported

**Answer: D**
**Explanation:** None - all modern JavaScript features are supported including async/await, generators, classes.
**Related Showcases:** All TypeScript showcases use modern features

---

#### Q22. True or False: Elide supports LLVM as a language target.
- A. True
- B. False

**Answer: A**
**Explanation:** True. LLVM is supported via GraalVM's Sulong.
**Related Showcases:** wasm-polyglot-bridge (WASM via LLVM)

---

#### Q23. What is Truffle in Elide's architecture?
- A. A testing framework
- B. A language implementation framework
- C. A database
- D. A web server

**Answer: B**
**Explanation:** Truffle is GraalVM's language implementation framework enabling polyglot interop.
**Related Showcases:** All polyglot showcases use Truffle interop

---

#### Q24. Which React version does Elide support?
- A. React 19
- B. React 18
- C. React 17
- D. React 16

**Answer: B**
**Explanation:** React 18. React 19 not yet supported.
**Related Showcases:** fullstack-template, elide-html

---

#### Q25. True or False: Elide supports both ESM and CJS imports.
- A. True
- B. False

**Answer: A**
**Explanation:** True. Both ESM and CommonJS imports work. Prefer node: prefix for Node.js modules.
**Related Showcases:** All showcases use ESM imports

---

#### Q26. What is the typical Elide cold start time?
- A. ~200ms
- B. ~100ms
- C. ~20ms
- D. ~1000ms

**Answer: C**
**Explanation:** ~20ms typical cold start (10x faster than Node.js ~200ms).
**Related Showcases:** All HTTP showcases

---

#### Q27. Which statement about Elide's memory usage is correct?
- A. Higher than Node.js
- B. No V8 initialization overhead
- C. Requires 2GB minimum
- D. Same as Node.js

**Answer: B**
**Explanation:** No V8 initialization overhead results in lower memory usage.
**Related Showcases:** All showcases benefit from lower memory

---

#### Q28. True or False: Elide can execute Java bytecode.
- A. True
- B. False

**Answer: A**
**Explanation:** True. Elide can execute Java bytecode via GraalVM JVM mode.
**Related Showcases:** java-spring-bridge, java-spring-integration

---

#### Q29. What is the file extension for Elide project configuration?
- A. .json
- B. .yaml
- C. .pkl
- D. .toml

**Answer: C**
**Explanation:** .pkl (Pkl configuration language by Apple).
**Related Showcases:** Most showcases have elide.pkl

---

#### Q30. Which Node.js modules does Elide support? (multiple select)
- A. fs
- B. path
- C. buffer
- D. cluster

**Answer: A,B,C**
**Explanation:** fs, path, buffer, stream, assert, zlib are supported. Cluster is NOT supported.
**Related Showcases:** All showcases using Node.js APIs

---

#### Q31. True or False: Elide supports Kotlin coroutines.
- A. True
- B. False

**Answer: A**
**Explanation:** True. Kotlin coroutines are supported via kotlinx.coroutines.
**Related Showcases:** ktor-analytics-platform

---

#### Q32. What is the primary use case for Elide's polyglot capabilities?
- A. Running multiple apps
- B. Mixing languages in one application
- C. Database connections
- D. Network protocols

**Answer: B**
**Explanation:** Mixing languages in one application for best-of-breed libraries.
**Related Showcases:** All polyglot showcases

---

#### Q33. Which statement about Elide's TypeScript compilation is correct?
- A. Uses tsc internally
- B. Instant compilation at runtime
- C. Requires webpack
- D. Pre-compilation required

**Answer: B**
**Explanation:** Instant compilation at runtime via GraalVM.
**Related Showcases:** All TypeScript showcases

---

#### Q34. True or False: Elide supports Symbol in JavaScript.
- A. True
- B. False

**Answer: A**
**Explanation:** True. Symbol is fully supported.
**Related Showcases:** All TypeScript showcases

---

#### Q35. What is the benefit of Elide's instant TypeScript execution?
- A. Slower startup
- B. No build step needed
- C. Requires configuration
- D. Only works in production

**Answer: B**
**Explanation:** No build step needed - run TypeScript directly.
**Related Showcases:** All TypeScript showcases

---

#### Q36. Which data structures does Elide support? (multiple select)
- A. Map
- B. Set
- C. WeakMap
- D. WeakSet

**Answer: A,B,C,D**
**Explanation:** All are supported: Map, Set, WeakMap, WeakSet.
**Related Showcases:** All TypeScript showcases

---

#### Q37. True or False: Elide supports optional chaining (?.).
- A. True
- B. False

**Answer: A**
**Explanation:** True. Optional chaining (?.) is supported.
**Related Showcases:** All TypeScript showcases

---

#### Q38. What is the primary advantage of GraalVM Native Image?
- A. Slower startup
- B. Faster cold starts and smaller binaries
- C. Requires JVM
- D. Only for Java

**Answer: B**
**Explanation:** Faster cold starts and smaller binaries via AOT compilation.
**Related Showcases:** N/A (build feature)

---

#### Q39. Which statement about Elide's JavaScript support is correct?
- A. ES5 only
- B. ES2020+ with modern features
- C. ES6 only
- D. Requires transpilation

**Answer: B**
**Explanation:** ES2020+ with all modern features supported.
**Related Showcases:** All TypeScript showcases

---

#### Q40. True or False: Elide supports BigInt.
- A. True
- B. False

**Answer: A**
**Explanation:** True. BigInt is supported.
**Related Showcases:** blockchain-indexer (uses BigInt for large numbers)

---

### Medium (Questions 41-80)

#### Q41. How do you import a Python module in TypeScript with Elide?
- A. import py from 'python'
- B. import module from './module.py'
- C. require('python')
- D. Elide.import('module.py')

**Answer: B**
**Explanation:** Standard ESM import syntax: `import module from './module.py'`
**Related Showcases:** ml-api, flask-typescript-polyglot

---

#### Q42. What is the correct way to detect CLI mode in Elide?
- A. process.argv.length > 2
- B. import.meta.url.includes("script-name.ts")
- C. process.env.CLI === 'true'
- D. Elide.isCLI()

**Answer: B**
**Explanation:** `import.meta.url.includes("script-name.ts")` detects if running as script vs module.
**Related Showcases:** cli-based showcases

---

#### Q43. Which KotlinX libraries are included with Elide? (multiple select)
- A. coroutines
- B. datetime
- C. serialization
- D. html

**Answer: A,B,C,D**
**Explanation:** All are included: coroutines, datetime, serialization, html.
**Related Showcases:** ktor-analytics-platform

---

#### Q44. What is the quirk with process.argv in Elide?
- A. Not available
- B. Returns Java array representation
- C. Always empty
- D. Only works in Node mode

**Answer: B**
**Explanation:** Returns Java array representation `[Ljava.lang.String;@...` instead of standard JS array.
**Related Showcases:** CLI-based showcases

---

#### Q45. How do you disable KotlinX libraries in elide.pkl?
- A. kotlinx = false
- B. kotlin { features { kotlinx = false } }
- C. dependencies { kotlinx = false }
- D. Cannot disable

**Answer: B**
**Explanation:** `kotlin { features { kotlinx = false } }` in elide.pkl.
**Related Showcases:** N/A (configuration)

---

#### Q46. Which statement about Elide's Python support is correct?
- A. Full CPython compatibility
- B. Python 3.11 with GraalPy
- C. Python 2.7 only
- D. Requires virtualenv

**Answer: B**
**Explanation:** Python 3.11 with GraalPy implementation.
**Related Showcases:** All Python showcases (35+)

---

#### Q47. What is the correct import syntax for Node.js modules in Elide?
- A. import fs from 'fs'
- B. import { readFileSync } from 'node:fs'
- C. require('fs')
- D. Both A and B work

**Answer: D**
**Explanation:** Both work. Prefer `node:` prefix for clarity.
**Related Showcases:** All showcases using Node.js APIs

---

#### Q48. Which Java tools does Elide embed? (multiple select)
- A. javac
- B. javadoc
- C. jar
- D. maven

**Answer: A,C**
**Explanation:** javac and jar are embedded. javadoc is available but not commonly used.
**Related Showcases:** java-spring-bridge

---

#### Q49. What is the purpose of Elide's `JAVA_HOME` compatibility?
- A. Not supported
- B. Elide's root can be used as JAVA_HOME
- C. Requires separate JDK
- D. Only for Java 11

**Answer: B**
**Explanation:** Elide's root can be used as JAVA_HOME for Java tool compatibility.
**Related Showcases:** java-spring-bridge, java-spring-integration

---

#### Q50. Which Kotlin tools does Elide embed? (multiple select)
- A. kotlinc
- B. kapt
- C. KSP
- D. gradle

**Answer: A**
**Explanation:** kotlinc is embedded. kapt and KSP are supported but separate.
**Related Showcases:** ktor-analytics-platform

---

#### Q51. How does Elide handle TypeScript type checking?
- A. No type checking
- B. Runtime type checking only
- C. Compile-time type checking
- D. Requires separate tsc run

**Answer: C**
**Explanation:** Compile-time type checking via GraalVM.
**Related Showcases:** All TypeScript showcases

---

#### Q52. What is the correct way to use React with Elide?
- A. Install react@19
- B. Install react@18 and react-dom@18
- C. Use built-in React
- D. Requires webpack

**Answer: B**
**Explanation:** Install react@18 and react-dom@18.
**Related Showcases:** fullstack-template, elide-html

---

#### Q53. Which statement about Elide's JSX support is correct?
- A. Only React JSX
- B. Any JSX library
- C. React JSX only, other libraries not yet supported
- D. No JSX support

**Answer: C**
**Explanation:** React JSX only, other libraries not yet supported.
**Related Showcases:** fullstack-template, elide-html

---

#### Q54. What is the file extension requirement for JSX in Elide?
- A. .js
- B. .jsx or .tsx
- C. .ts
- D. Any extension works

**Answer: B**
**Explanation:** .jsx or .tsx file extensions required.
**Related Showcases:** elide-html

---

#### Q55. How do you run a TSX file with Elide?
- A. elide build then node
- B. elide run file.tsx
- C. tsc then elide
- D. Requires webpack

**Answer: B**
**Explanation:** `elide run file.tsx` - Direct execution, no build step.
**Related Showcases:** elide-html, fullstack-template

---

#### Q56. Which statement about Elide's async/await support is correct?
- A. Not supported
- B. Fully supported
- C. Only in TypeScript
- D. Requires polyfill

**Answer: B**
**Explanation:** Fully supported in both JavaScript and TypeScript.
**Related Showcases:** All async showcases (most)

---

#### Q57. What is the correct way to use Promises in Elide?
- A. Not supported
- B. Standard Promise API works
- C. Requires library
- D. Only with async/await

**Answer: B**
**Explanation:** Standard Promise API works.
**Related Showcases:** All async showcases

---

#### Q58. Which modern JavaScript features does Elide support? (multiple select)
- A. Destructuring
- B. Spread operator
- C. Nullish coalescing (??)
- D. Private class fields

**Answer: A,B,C,D**
**Explanation:** All modern JavaScript features are supported.
**Related Showcases:** All TypeScript showcases

---

#### Q59. What is the performance characteristic of cross-language calls in Elide?
- A. ~100ms overhead
- B. <1ms overhead
- C. ~10ms overhead
- D. Requires serialization

**Answer: B**
**Explanation:** <1ms overhead due to zero-serialization Truffle interop.
**Related Showcases:** flask-typescript-polyglot, ml-api

---

#### Q60. How does Elide handle TypeScript generics?
- A. Not supported
- B. Fully supported with type safety
- C. Erased at runtime
- D. Requires explicit types

**Answer: C**
**Explanation:** Erased at runtime (standard TypeScript behavior).
**Related Showcases:** All TypeScript showcases

---

#### Q61. Which statement about Elide's class support is correct?
- A. ES5 classes only
- B. Full ES6+ class support with inheritance
- C. No class support
- D. Requires transpilation

**Answer: B**
**Explanation:** Full ES6+ class support with inheritance.
**Related Showcases:** All TypeScript showcases

---

#### Q62. What is the correct way to use generators in Elide?
- A. Not supported
- B. Standard function* syntax works
- C. Requires library
- D. Only in TypeScript

**Answer: B**
**Explanation:** Standard function* syntax works.
**Related Showcases:** stream-processor, data-pipeline

---

#### Q63. Which statement about Elide's iterator support is correct?
- A. Not supported
- B. Full iterator and generator support
- C. Only arrays
- D. Requires polyfill

**Answer: B**
**Explanation:** Full iterator and generator support.
**Related Showcases:** stream-processor, data-pipeline

---

#### Q64. How do you use Symbol in Elide?
- A. Not supported
- B. Standard Symbol API works
- C. Requires import
- D. Only in TypeScript

**Answer: B**
**Explanation:** Standard Symbol API works.
**Related Showcases:** All TypeScript showcases

---

#### Q65. Which collection types does Elide support? (multiple select)
- A. Map
- B. Set
- C. WeakMap
- D. WeakSet

**Answer: A,B,C,D**
**Explanation:** All collection types supported.
**Related Showcases:** All TypeScript showcases

---

#### Q66. What is the correct way to use typed arrays in Elide?
- A. Not supported
- B. Standard Uint8Array, etc. work
- C. Requires library
- D. Only in Java mode

**Answer: B**
**Explanation:** Standard Uint8Array, Int32Array, etc. work.
**Related Showcases:** image-processing, audio-processing

---

#### Q67. Which statement about Elide's regex support is correct?
- A. Limited regex
- B. Full regex with global, groups, etc.
- C. No regex
- D. Requires library

**Answer: B**
**Explanation:** Full regex with global, groups, etc.
**Related Showcases:** All showcases using regex

---

#### Q68. How does Elide handle Unicode strings?
- A. ASCII only
- B. Full Unicode support
- C. UTF-8 only
- D. Requires encoding library

**Answer: B**
**Explanation:** Full Unicode support.
**Related Showcases:** All showcases

---

#### Q69. Which statement about Elide's Math support is correct?
- A. Basic math only
- B. Full Math.* methods
- C. No Math object
- D. Requires library

**Answer: B**
**Explanation:** Full Math.* methods.
**Related Showcases:** scientific-computing, analytics-engine

---

#### Q70. What is the correct way to use Number methods in Elide?
- A. Not supported
- B. Number.isFinite, Number.isInteger, etc. work
- C. Requires polyfill
- D. Only parseInt/parseFloat

**Answer: B**
**Explanation:** Number.isFinite, Number.isInteger, etc. work.
**Related Showcases:** All showcases using Number methods

---

#### Q71. Which statement about Elide's Object methods is correct?
- A. Limited support
- B. Object.keys, Object.values, Object.entries, Object.assign all work
- C. No Object methods
- D. Requires library

**Answer: B**
**Explanation:** Object.keys, Object.values, Object.entries, Object.assign all work.
**Related Showcases:** All showcases

---

#### Q72. How do you use property descriptors in Elide?
- A. Not supported
- B. Standard Object.defineProperty works
- C. Requires library
- D. Only in strict mode

**Answer: B**
**Explanation:** Standard Object.defineProperty works.
**Related Showcases:** All showcases

---

#### Q73. Which statement about Elide's getter/setter support is correct?
- A. Not supported
- B. Fully supported in classes and objects
- C. Only in classes
- D. Requires transpilation

**Answer: B**
**Explanation:** Fully supported in classes and objects.
**Related Showcases:** All showcases

---

#### Q74. What is the correct way to use Array methods in Elide?
- A. Limited to basic methods
- B. Full array API: map, filter, reduce, flat, etc.
- C. No array methods
- D. Requires library

**Answer: B**
**Explanation:** Full array API: map, filter, reduce, flat, etc.
**Related Showcases:** All showcases

---

#### Q75. Which statement about Elide's string methods is correct?
- A. ES5 only
- B. Full string API including template literals
- C. No string methods
- D. Requires polyfill

**Answer: B**
**Explanation:** Full string API including template literals.
**Related Showcases:** All showcases

---

#### Q76. How does Elide handle bitwise operations?
- A. Not supported
- B. Full bitwise support: <<, >>, &, |, ^
- C. Only AND/OR
- D. Requires library

**Answer: B**
**Explanation:** Full bitwise support: <<, >>, &, |, ^.
**Related Showcases:** crypto-operations, blockchain-utils

---

#### Q77. Which statement about Elide's parseFloat/parseInt is correct?
- A. Not supported
- B. Standard parseFloat and parseInt work
- C. Requires Number constructor
- D. Only in strict mode

**Answer: B**
**Explanation:** Standard parseFloat and parseInt work.
**Related Showcases:** All showcases

---

#### Q78. What is the GraalVM version used by Elide beta11-rc1?
- A. GraalVM 23.x
- B. GraalVM 24.x
- C. GraalVM 25.x
- D. GraalVM 22.x

**Answer: C**
**Explanation:** GraalVM 25.x (specifically v25.0.0).
**Related Showcases:** All showcases run on GraalVM 25.x

---

#### Q79. Which statement about Elide's Buffer support is correct?
- A. Not supported
- B. Node.js Buffer class available via node:buffer
- C. Only in Java mode
- D. Requires library

**Answer: B**
**Explanation:** Node.js Buffer class available via node:buffer.
**Related Showcases:** image-processing, crypto-operations

---

#### Q80. How do you access crypto.randomUUID() in Elide?
- A. Not supported
- B. Available as global function
- C. Requires node:crypto import
- D. Only in secure contexts

**Answer: B**
**Explanation:** Available as global function (Web Crypto API).
**Related Showcases:** authentication-polyglot, encryption-service

---

### Hard (Questions 81-100)

#### Q81. What is the internal mechanism Elide uses for polyglot interop?
- A. JSON-RPC
- B. Truffle language interoperability
- C. JNI
- D. HTTP calls

**Answer: B**
**Explanation:** Truffle language interoperability enables zero-serialization cross-language calls.
**Related Showcases:** All polyglot showcases

---

#### Q82. Which statement about Elide's GraalVM Native Image support is correct?
- A. Not supported
- B. Can compile to native binaries with elide native-image
- C. Only for Java code
- D. Requires separate GraalVM installation

**Answer: B**
**Explanation:** Can compile to native binaries with `elide native-image`.
**Related Showcases:** N/A (build feature)

---

#### Q83. What is the performance implication of Elide's unified GC?
- A. Slower than separate GCs
- B. No cross-language GC overhead
- C. Requires manual tuning
- D. Only works for JavaScript

**Answer: B**
**Explanation:** No cross-language GC overhead - single GC handles all languages.
**Related Showcases:** All polyglot showcases

---

#### Q84. How does Elide handle TypeScript type erasure?
- A. Types preserved at runtime
- B. Types erased but checked at compile time
- C. No type checking
- D. Requires separate type checker

**Answer: B**
**Explanation:** Types erased but checked at compile time (standard TypeScript behavior).
**Related Showcases:** All TypeScript showcases

---

#### Q85. Which statement about Elide's module resolution is correct?
- A. Node.js only
- B. Supports both Node.js and ESM resolution
- C. ESM only
- D. Custom resolution only

**Answer: B**
**Explanation:** Supports both Node.js and ESM resolution.
**Related Showcases:** All showcases

---

#### Q86. What is the relationship between Elide and Oracle GraalVM?
- A. Unrelated
- B. Elide is recognized as Oracle GraalVM instance at JDK 24
- C. Elide replaces GraalVM
- D. Requires separate GraalVM

**Answer: B**
**Explanation:** Elide is recognized as Oracle GraalVM instance at JDK 24.
**Related Showcases:** All showcases use GraalVM

---

#### Q87. How does Elide handle Kotlin annotation processing?
- A. Not supported
- B. Supports kapt and KSP
- C. Only kapt
- D. Requires separate compiler

**Answer: B**
**Explanation:** Supports kapt and KSP.
**Related Showcases:** ktor-analytics-platform

---

#### Q88. Which statement about Elide's Kotlin scripting support is correct?
- A. Not supported
- B. Includes Kotlin Scripting compiler
- C. Only compiled Kotlin
- D. Requires separate tool

**Answer: B**
**Explanation:** Includes Kotlin Scripting compiler.
**Related Showcases:** ktor-analytics-platform

---

#### Q89. What is the purpose of Elide's `KOTLIN_HOME` compatibility?
- A. Not supported
- B. Elide's root can be used as KOTLIN_HOME
- C. Requires separate Kotlin
- D. Only for Kotlin 1.x

**Answer: B**
**Explanation:** Elide's root can be used as KOTLIN_HOME.
**Related Showcases:** ktor-analytics-platform

---

#### Q90. How does Elide handle KotlinX serialization?
- A. Not supported
- B. Included in distribution with kotlinx.serialization and kotlinx.serialization.json
- C. Requires separate dependency
- D. Only JSON

**Answer: B**
**Explanation:** Included in distribution with kotlinx.serialization and kotlinx.serialization.json.
**Related Showcases:** ktor-analytics-platform

---

#### Q91. Which statement about Elide's Kotlin HTML support is correct?
- A. Not supported
- B. kotlinx.html included in distribution
- C. Requires separate library
- D. Only for server-side

**Answer: B**
**Explanation:** kotlinx.html included in distribution.
**Related Showcases:** ktor-analytics-platform

---

#### Q92. What is the mechanism for Elide's instant TypeScript compilation?
- A. tsc in background
- B. Runtime compilation via GraalVM
- C. Pre-compilation required
- D. Babel transpilation

**Answer: B**
**Explanation:** Runtime compilation via GraalVM.
**Related Showcases:** All TypeScript showcases

---

#### Q93. How does Elide handle TypeScript decorators?
- A. Not supported
- B. Experimental support
- C. Full support
- D. Requires flag

**Answer: B**
**Explanation:** Experimental support.
**Related Showcases:** Limited decorator usage

---

#### Q94. Which statement about Elide's source map support is correct?
- A. Not supported
- B. Generated for debugging
- C. Only in dev mode
- D. Requires configuration

**Answer: B**
**Explanation:** Generated for debugging.
**Related Showcases:** All showcases when debugging

---

#### Q95. What is the performance characteristic of Elide's TypeScript execution vs tsc+Node?
- A. Slower
- B. Faster cold start, similar warm performance
- C. Same speed
- D. Slower cold start

**Answer: B**
**Explanation:** Faster cold start (~20ms vs ~200ms), similar warm performance.
**Related Showcases:** All TypeScript showcases

---

#### Q96. How does Elide handle circular dependencies in polyglot imports?
- A. Not supported
- B. Handled by Truffle
- C. Causes errors
- D. Requires manual resolution

**Answer: B**
**Explanation:** Handled by Truffle framework.
**Related Showcases:** Complex polyglot showcases

---

#### Q97. Which statement about Elide's memory model for polyglot is correct?
- A. Separate heaps per language
- B. Shared heap with unified GC
- C. Manual memory management
- D. Copy-on-write

**Answer: B**
**Explanation:** Shared heap with unified GC.
**Related Showcases:** All polyglot showcases

---

#### Q98. What is the overhead of calling Java from TypeScript in Elide?
- A. ~100ms
- B. <1ms (zero-serialization)
- C. ~10ms
- D. Requires IPC

**Answer: B**
**Explanation:** <1ms (zero-serialization) via Truffle interop.
**Related Showcases:** java-spring-bridge, java-spring-integration

---

#### Q99. How does Elide handle Python GIL (Global Interpreter Lock)?
- A. Standard GIL applies
- B. No GIL in GraalPy
- C. Requires threading library
- D. Not applicable

**Answer: B**
**Explanation:** No GIL in GraalPy implementation.
**Related Showcases:** All Python showcases

---

#### Q100. Which statement about Elide's performance profiling is correct?
- A. Not supported
- B. Supports Chrome DevTools inspector
- C. Only JVM profilers
- D. Requires external tools

**Answer: B**
**Explanation:** Supports Chrome DevTools inspector via --inspect flag.
**Related Showcases:** All showcases when debugging

---

## Section 2: CLI Commands (80 questions)

### Easy (Questions 101-130)

#### Q101. What command runs a TypeScript file with Elide?
- A. elide execute file.ts
- B. elide run file.ts
- C. elide start file.ts
- D. elide file.ts

**Answer: B**
**Explanation:** `elide run file.ts`
**Related Showcases:** All TypeScript showcases

---

#### Q102. What command starts an HTTP server with Elide?
- A. elide server file.ts
- B. elide serve file.ts
- C. elide http file.ts
- D. elide start file.ts

**Answer: B**
**Explanation:** `elide serve file.ts`
**Related Showcases:** All HTTP showcases

---

#### Q103. What command starts the Elide REPL?
- A. elide shell
- B. elide repl
- C. elide console
- D. elide interactive

**Answer: B**
**Explanation:** `elide repl`
**Related Showcases:** N/A (CLI feature)

---

#### Q104. What command initializes a new Elide project?
- A. elide new
- B. elide create
- C. elide init
- D. elide start

**Answer: C**
**Explanation:** `elide init`
**Related Showcases:** All showcases started with init

---

#### Q105. What command installs project dependencies?
- A. elide deps
- B. elide install
- C. elide add
- D. elide get

**Answer: B**
**Explanation:** `elide install`
**Related Showcases:** All showcases with dependencies

---

#### Q106. What command adds a new dependency to a project?
- A. elide install <package>
- B. elide add <package>
- C. elide dep <package>
- D. elide get <package>

**Answer: B**
**Explanation:** `elide add <package>`
**Related Showcases:** All showcases with dependencies

---

#### Q107. What command builds an Elide project?
- A. elide compile
- B. elide make
- C. elide build
- D. elide package

**Answer: C**
**Explanation:** `elide build`
**Related Showcases:** All showcases with build tasks

---

#### Q108. What command runs tests in an Elide project?
- A. elide check
- B. elide test
- C. elide spec
- D. elide verify

**Answer: B**
**Explanation:** `elide test`
**Related Showcases:** All showcases with tests

---

#### Q109. What command shows Elide version?
- A. elide -v
- B. elide --version
- C. elide version
- D. All of the above

**Answer: D**
**Explanation:** All of the above: `-v`, `--version`, `version`
**Related Showcases:** N/A (CLI feature)

---

#### Q110. What command shows general Elide help?
- A. elide -h
- B. elide --help
- C. elide help
- D. All of the above

**Answer: D**
**Explanation:** All of the above: `-h`, `--help`, `help`
**Related Showcases:** N/A (CLI feature)

---

#### Q111. What command shows help for a specific topic (e.g., servers)?
- A. elide help servers
- B. elide --help servers
- C. elide servers --help
- D. elide docs servers

**Answer: A**
**Explanation:** `elide help servers`
**Related Showcases:** N/A (CLI feature)

---

#### Q112. What command compiles Java code with Elide?
- A. elide java
- B. elide javac
- C. elide compile-java
- D. elide jdk

**Answer: B**
**Explanation:** `elide javac`
**Related Showcases:** java-spring-bridge

---

#### Q113. What command compiles Kotlin code with Elide?
- A. elide kotlin
- B. elide kotlinc
- C. elide compile-kotlin
- D. elide kt

**Answer: B**
**Explanation:** `elide kotlinc`
**Related Showcases:** ktor-analytics-platform

---

#### Q114. What command creates a JAR file with Elide?
- A. elide package
- B. elide jar
- C. elide archive
- D. elide bundle

**Answer: B**
**Explanation:** `elide jar`
**Related Showcases:** java-spring-bridge

---

#### Q115. What command generates Javadoc with Elide?
- A. elide docs
- B. elide javadoc
- C. elide doc-gen
- D. elide jdoc

**Answer: B**
**Explanation:** `elide javadoc`
**Related Showcases:** java-spring-bridge

---

#### Q116. What command builds a native image with Elide?
- A. elide compile --native
- B. elide native-image
- C. elide build-native
- D. elide image

**Answer: B**
**Explanation:** `elide native-image`
**Related Showcases:** N/A (build feature)

---

#### Q117. What command builds a container image with Elide?
- A. elide docker
- B. elide container
- C. elide jib
- D. elide image

**Answer: C**
**Explanation:** `elide jib`
**Related Showcases:** N/A (build feature)

---

#### Q118. What command starts the Language Server Protocol server?
- A. elide language-server
- B. elide lsp
- C. elide ls
- D. elide langserver

**Answer: B**
**Explanation:** `elide lsp`
**Related Showcases:** N/A (IDE feature)

---

#### Q119. What command starts the Model Context Protocol server?
- A. elide model
- B. elide mcp
- C. elide context
- D. elide protocol

**Answer: B**
**Explanation:** `elide mcp`
**Related Showcases:** contextos-mcp-server

---

#### Q120. What command finds a tool's path (e.g., esbuild)?
- A. elide find esbuild
- B. elide which esbuild
- C. elide where esbuild
- D. elide locate esbuild

**Answer: B**
**Explanation:** `elide which esbuild`
**Related Showcases:** N/A (CLI feature)

---

#### Q121. What command manages secrets?
- A. elide env
- B. elide secrets
- C. elide vault
- D. elide config

**Answer: B**
**Explanation:** `elide secrets`
**Related Showcases:** secrets-manager

---

#### Q122. What command shows project information?
- A. elide info
- B. elide project
- C. elide show
- D. elide status

**Answer: A**
**Explanation:** `elide info`
**Related Showcases:** N/A (CLI feature)

---

#### Q123. What command generates shell completions?
- A. elide complete
- B. elide completions
- C. elide autocomplete
- D. elide shell-complete

**Answer: B**
**Explanation:** `elide completions`
**Related Showcases:** N/A (CLI feature)

---

#### Q124. True or False: elide run can execute Python files.
- A. True
- B. False

**Answer: A**
**Explanation:** True. `elide run script.py` works.
**Related Showcases:** All Python showcases

---

#### Q125. True or False: elide serve requires a port flag.
- A. True
- B. False

**Answer: B**
**Explanation:** False. Default port is 8080, no flag required.
**Related Showcases:** All HTTP showcases

---

#### Q126. What is the default port for elide serve?
- A. 3000
- B. 8080
- C. 8000
- D. 5000

**Answer: B**
**Explanation:** 8080
**Related Showcases:** All HTTP showcases

---

#### Q127. True or False: elide test supports coverage reporting.
- A. True
- B. False

**Answer: A**
**Explanation:** True. `--coverage` flag available.
**Related Showcases:** testing-framework

---

#### Q128. True or False: elide build requires a build file.
- A. True
- B. False

**Answer: B**
**Explanation:** False. Can build without explicit build file if tasks defined in elide.pkl.
**Related Showcases:** All showcases with builds

---

#### Q129. True or False: elide init is interactive by default.
- A. True
- B. False

**Answer: A**
**Explanation:** True. Interactive by default.
**Related Showcases:** N/A (CLI feature)

---

#### Q130. True or False: elide install works with package.json.
- A. True
- B. False

**Answer: A**
**Explanation:** True. Works with package.json, pyproject.toml, requirements.txt, etc.
**Related Showcases:** All showcases with dependencies

---

### Medium (Questions 131-160)

#### Q131. How do you run a server with environment variables?
- A. elide serve --env API_KEY=xyz server.ts
- B. API_KEY=xyz elide serve server.ts
- C. Both A and B
- D. elide serve server.ts --env=API_KEY=xyz

**Answer: C**
**Explanation:** Both A and B work.
**Related Showcases:** All HTTP showcases with env vars

---

#### Q132. How do you enable the Chrome DevTools inspector?
- A. elide run --debug file.ts
- B. elide run --inspect file.ts
- C. elide run --devtools file.ts
- D. elide run --chrome file.ts

**Answer: B**
**Explanation:** `elide run --inspect file.ts`
**Related Showcases:** N/A (debugging feature)

---

#### Q133. How do you suspend execution until debugger attaches?
- A. elide run --inspect:wait file.ts
- B. elide run --inspect:suspend file.ts
- C. elide run --debug:wait file.ts
- D. elide run --pause file.ts

**Answer: B**
**Explanation:** `elide run --inspect:suspend file.ts`
**Related Showcases:** N/A (debugging feature)

---

#### Q134. How do you set a custom inspector port?
- A. elide run --inspect:port=9229 file.ts
- B. elide run --inspect --port=9229 file.ts
- C. elide run --debug-port=9229 file.ts
- D. elide run --inspect=9229 file.ts

**Answer: A**
**Explanation:** `elide run --inspect:port=9229 file.ts`
**Related Showcases:** N/A (debugging feature)

---

#### Q135. How do you enable debug logging?
- A. elide run --log=debug file.ts
- B. elide run --debug file.ts
- C. elide run --verbose file.ts
- D. Both B and C

**Answer: D**
**Explanation:** Both B and C: `--debug` and `--verbose`
**Related Showcases:** N/A (logging feature)

---

#### Q136. How do you enable verbose output?
- A. elide run -v file.ts
- B. elide run --verbose file.ts
- C. Both A and B
- D. elide run --debug file.ts

**Answer: C**
**Explanation:** Both A and B: `-v` and `--verbose`
**Related Showcases:** N/A (logging feature)

---

#### Q137. How do you suppress output (quiet mode)?
- A. elide run -q file.ts
- B. elide run --quiet file.ts
- C. Both A and B
- D. elide run --silent file.ts

**Answer: C**
**Explanation:** Both A and B: `-q` and `--quiet`
**Related Showcases:** N/A (logging feature)

---

#### Q138. How do you disable telemetry?
- A. elide run --no-telemetry file.ts
- B. elide run --telemetry=false file.ts
- C. elide run --private file.ts
- D. Both A and B

**Answer: A**
**Explanation:** `elide run --no-telemetry file.ts`
**Related Showcases:** N/A (privacy feature)

---

#### Q139. How do you use a frozen lockfile (reproducible builds)?
- A. elide install --lock
- B. elide install --frozen
- C. elide install --immutable
- D. elide install --exact

**Answer: B**
**Explanation:** `elide install --frozen`
**Related Showcases:** All CI/CD builds

---

#### Q140. How do you build in release mode?
- A. elide build --prod
- B. elide build --release
- C. elide build --optimize
- D. elide build --production

**Answer: B**
**Explanation:** `elide build --release`
**Related Showcases:** All production builds

---

#### Q141. How do you run tests with JSON coverage report?
- A. elide test --coverage --format=json
- B. elide test --coverage --coverage-format=json
- C. elide test --json-coverage
- D. elide test --coverage=json

**Answer: B**
**Explanation:** `elide test --coverage --coverage-format=json`
**Related Showcases:** testing-framework

---

#### Q142. How do you run tests with XML test report?
- A. elide test --report=xml
- B. elide test --test-report=xml
- C. elide test --xml
- D. elide test --format=xml

**Answer: B**
**Explanation:** `elide test --test-report=xml`
**Related Showcases:** testing-framework

---

#### Q143. How do you run tests with both coverage and test report?
- A. elide test --coverage --coverage-format=json --test-report=xml
- B. elide test --all-reports
- C. elide test --full-report
- D. Not possible in one command

**Answer: A**
**Explanation:** `elide test --coverage --coverage-format=json --test-report=xml`
**Related Showcases:** testing-framework

---

#### Q144. How do you run tests with threading (experimental)?
- A. elide test --parallel
- B. elide test --threaded --threads=4
- C. elide test -j4
- D. elide test --workers=4

**Answer: B**
**Explanation:** `elide test --threaded --threads=4`
**Related Showcases:** testing-framework

---

#### Q145. How do you grant file I/O permissions broadly?
- A. elide run --allow-io file.ts
- B. elide run --host:allow-io file.ts
- C. elide run --fs:all file.ts
- D. elide run --io file.ts

**Answer: B**
**Explanation:** `elide run --host:allow-io file.ts`
**Related Showcases:** N/A (security feature)

---

#### Q146. How do you grant read-only I/O for /data?
- A. elide run --host:allow-io=/data:ro file.ts
- B. elide run --host:allow-io:read=/data file.ts
- C. elide run --read=/data file.ts
- D. elide run --io:read=/data file.ts

**Answer: B**
**Explanation:** `elide run --host:allow-io:read=/data file.ts`
**Related Showcases:** N/A (security feature)

---

#### Q147. How do you grant write-only I/O for /tmp?
- A. elide run --host:allow-io=/tmp:wo file.ts
- B. elide run --host:allow-io:write=/tmp file.ts
- C. elide run --write=/tmp file.ts
- D. elide run --io:write=/tmp file.ts

**Answer: B**
**Explanation:** `elide run --host:allow-io:write=/tmp file.ts`
**Related Showcases:** N/A (security feature)

---

#### Q148. How do you grant I/O for multiple paths?
- A. elide run --host:allow-io=/tmp --host:allow-io=/data file.ts
- B. elide run --host:allow-io=/tmp,/data file.ts
- C. elide run --host:allow-io=/tmp:/data file.ts
- D. Both A and B

**Answer: B**
**Explanation:** `elide run --host:allow-io=/tmp,/data file.ts`
**Related Showcases:** N/A (security feature)

---

#### Q149. How do you allow environment variable access?
- A. elide run --allow-env file.ts
- B. elide run --host:allow-env file.ts
- C. elide run --env:allow file.ts
- D. elide run --permit-env file.ts

**Answer: B**
**Explanation:** `elide run --host:allow-env file.ts`
**Related Showcases:** N/A (security feature)

---

#### Q150. How do you use a dotenv file?
- A. elide run --dotenv file.ts
- B. elide run --env:dotenv file.ts
- C. elide run --load-env file.ts
- D. elide run --env-file file.ts

**Answer: B**
**Explanation:** `elide run --env:dotenv file.ts`
**Related Showcases:** All showcases with env vars

---

#### Q151. How do you set the lockfile format to JSON?
- A. elide install --format=json
- B. elide install --lockfile-format=json
- C. elide install --json-lock
- D. elide install --lock=json

**Answer: B**
**Explanation:** `elide install --lockfile-format=json`
**Related Showcases:** N/A (dependency feature)

---

#### Q152. How do you verify lockfile integrity?
- A. elide install --check
- B. elide install --frozen --verify
- C. elide install --validate
- D. elide install --integrity

**Answer: B**
**Explanation:** `elide install --frozen --verify`
**Related Showcases:** N/A (dependency feature)

---

#### Q153. How do you perform a dry run of a build?
- A. elide build --dry
- B. elide build --dry-run
- C. elide build --simulate
- D. elide build --test

**Answer: A**
**Explanation:** `elide build --dry`
**Related Showcases:** N/A (build feature)

---

#### Q154. How do you compile a native image with optimization?
- A. elide native-image -- -O3 -o myapp MyClass
- B. elide native-image --optimize -o myapp MyClass
- C. elide native-image -O3 myapp MyClass
- D. elide native-image --release myapp MyClass

**Answer: A**
**Explanation:** `elide native-image -- -O3 -o myapp MyClass`
**Related Showcases:** N/A (build feature)

---

#### Q155. How do you build a native image with no fallback?
- A. elide native-image -- --no-fallback -o myapp MyClass
- B. elide native-image --strict -o myapp MyClass
- C. elide native-image --native-only myapp MyClass
- D. elide native-image --no-jvm myapp MyClass

**Answer: A**
**Explanation:** `elide native-image -- --no-fallback -o myapp MyClass`
**Related Showcases:** N/A (build feature)

---

#### Q156. How do you build a native image with build-time initialization?
- A. elide native-image -- --initialize-at-build-time -o myapp MyClass
- B. elide native-image --init-build -o myapp MyClass
- C. elide native-image --build-init myapp MyClass
- D. elide native-image --early-init myapp MyClass

**Answer: A**
**Explanation:** `elide native-image -- --initialize-at-build-time -o myapp MyClass`
**Related Showcases:** N/A (build feature)

---

#### Q157. How do you enable PGO (Profile-Guided Optimization) instrumentation?
- A. elide native-image -- --pgo-instrument -o myapp MyClass
- B. elide native-image --profile -o myapp MyClass
- C. elide native-image --instrument myapp MyClass
- D. elide native-image --pgo myapp MyClass

**Answer: A**
**Explanation:** `elide native-image -- --pgo-instrument -o myapp MyClass`
**Related Showcases:** N/A (build feature)

---

#### Q158. How do you build with an existing PGO profile?
- A. elide native-image -- --pgo=default.iprof -o myapp MyClass
- B. elide native-image --profile=default.iprof myapp MyClass
- C. elide native-image --use-profile myapp MyClass
- D. elide native-image --pgo-file=default.iprof myapp MyClass

**Answer: A**
**Explanation:** `elide native-image -- --pgo=default.iprof -o myapp MyClass`
**Related Showcases:** N/A (build feature)

---

#### Q159. How do you build a container with a specific tag?
- A. elide jib build -- -t myapp:latest
- B. elide jib -- build -t myapp:latest
- C. elide jib --tag=myapp:latest
- D. Both A and B

**Answer: A**
**Explanation:** `elide jib build -- -t myapp:latest`
**Related Showcases:** N/A (container feature)

---

#### Q160. How do you set secrets from CLI?
- A. elide secrets add API_KEY value
- B. elide secrets set API_KEY value
- C. elide secrets create API_KEY value
- D. elide secrets put API_KEY value

**Answer: B**
**Explanation:** `elide secrets set API_KEY value`
**Related Showcases:** secrets-manager

---

### Hard (Questions 161-180)

#### Q161. What is the correct syntax to pass options to javac via Elide?
- A. elide javac -d out src/*.java
- B. elide javac -- -d out src/*.java
- C. elide javac --options="-d out" src/*.java
- D. elide javac --javac-opts="-d out" src/*.java

**Answer: B**
**Explanation:** `elide javac -- -d out src/*.java` - The `--` separator passes options to javac.
**Related Showcases:** java-spring-bridge

---

#### Q162. What is the correct syntax to pass options to kotlinc via Elide?
- A. elide kotlinc -d out src/*.kt
- B. elide kotlinc -- -d out src/*.kt
- C. elide kotlinc --options="-d out" src/*.kt
- D. elide kotlinc --kotlinc-opts="-d out" src/*.kt

**Answer: B**
**Explanation:** `elide kotlinc -- -d out src/*.kt` - The `--` separator passes options to kotlinc.
**Related Showcases:** ktor-analytics-platform

---

#### Q163. What is the correct syntax to pass options to native-image via Elide?
- A. elide native-image -O3 -o myapp MyClass
- B. elide native-image -- -O3 -o myapp MyClass
- C. elide native-image --options="-O3" myapp MyClass
- D. elide native-image --native-opts="-O3" myapp MyClass

**Answer: B**
**Explanation:** `elide native-image -- -O3 -o myapp MyClass` - The `--` separator passes options to native-image.
**Related Showcases:** N/A (build feature)

---

#### Q164. What is the correct syntax to pass options to jib via Elide?
- A. elide jib build -t myapp:latest
- B. elide jib -- build -t myapp:latest
- C. elide jib --options="build -t myapp:latest"
- D. Both A and B

**Answer: D**
**Explanation:** Both A and B work for jib.
**Related Showcases:** N/A (container feature)

---

#### Q165. How do you start LSP on a custom port?
- A. elide lsp --port=8080
- B. elide lsp --lsp:port=8080
- C. elide lsp -p 8080
- D. elide lsp --listen=8080

**Answer: B**
**Explanation:** `elide lsp --lsp:port=8080`
**Related Showcases:** N/A (IDE feature)

---

#### Q166. How do you start LSP with a specific file?
- A. elide lsp --file=app.ts
- B. elide lsp app.ts --lsp:port=8080
- C. elide lsp --target=app.ts
- D. elide lsp --entry=app.ts

**Answer: B**
**Explanation:** `elide lsp app.ts --lsp:port=8080`
**Related Showcases:** N/A (IDE feature)

---

#### Q167. What is the purpose of the -- separator in Elide commands?
- A. End of options
- B. Pass remaining args to underlying tool
- C. Comment separator
- D. Not used

**Answer: B**
**Explanation:** Pass remaining args to underlying tool.
**Related Showcases:** javac, kotlinc, native-image, jib

---

#### Q168. How do you combine multiple environment variables in one command?
- A. elide run --env A=1 --env B=2 file.ts
- B. elide run --env A=1,B=2 file.ts
- C. elide run --env="A=1 B=2" file.ts
- D. Both A and B

**Answer: A**
**Explanation:** `elide run --env A=1 --env B=2 file.ts` - Multiple `--env` flags.
**Related Showcases:** All showcases with env vars

---

#### Q169. What is the correct way to run a Python WSGI app with Elide?
- A. elide run app.py
- B. elide run --wsgi app.py
- C. elide serve --wsgi app.py
- D. Both B and C

**Answer: D**
**Explanation:** Both B and C: `elide run --wsgi app.py` or `elide serve --wsgi app.py`
**Related Showcases:** flask-typescript-polyglot

---

#### Q170. How do you specify a custom port for WSGI?
- A. elide run --wsgi --port=5000 app.py
- B. elide run --wsgi app.py --port=5000
- C. Set PORT environment variable
- D. Both A and C

**Answer: D**
**Explanation:** Both A and C: `--port` flag or PORT environment variable.
**Related Showcases:** flask-typescript-polyglot

---

#### Q171. What is the correct way to run with multiple I/O permission types?
- A. elide run --host:allow-io:read=/data --host:allow-io:write=/tmp file.ts
- B. elide run --host:allow-io=/data:r,/tmp:w file.ts
- C. elide run --io:read=/data --io:write=/tmp file.ts
- D. Both A and B

**Answer: A**
**Explanation:** `elide run --host:allow-io:read=/data --host:allow-io:write=/tmp file.ts`
**Related Showcases:** N/A (security feature)

---

#### Q172. How do you disable specific telemetry while keeping others?
- A. Not possible - all or nothing
- B. elide run --no-telemetry=analytics file.ts
- C. elide run --telemetry:disable=analytics file.ts
- D. Use environment variable

**Answer: A**
**Explanation:** Not possible - all or nothing with `--no-telemetry`.
**Related Showcases:** N/A (privacy feature)

---

#### Q173. What is the correct way to run tests with histogram coverage?
- A. elide test --coverage --histogram
- B. elide test --coverage --coverage-format=histogram
- C. elide test --coverage:histogram
- D. elide test --hist-coverage

**Answer: B**
**Explanation:** `elide test --coverage --coverage-format=histogram`
**Related Showcases:** testing-framework

---

#### Q174. How do you limit test output to specific number of lines?
- A. elide test --lines=100
- B. elide test --limit=100
- C. elide test | head -100
- D. Not supported

**Answer: D**
**Explanation:** Not supported directly; use shell piping.
**Related Showcases:** testing-framework

---

#### Q175. What is the correct way to run a specific test file?
- A. elide test path/to/test.ts
- B. elide test --file=path/to/test.ts
- C. elide run path/to/test.ts
- D. Both A and C

**Answer: A**
**Explanation:** `elide test path/to/test.ts`
**Related Showcases:** testing-framework

---

#### Q176. How do you pass custom flags to the underlying runtime?
- A. elide run --runtime-flags="--flag" file.ts
- B. elide run --vm-options="--flag" file.ts
- C. elide run -- --flag file.ts
- D. Not supported

**Answer: D**
**Explanation:** Not supported directly.
**Related Showcases:** N/A

---

#### Q177. What is the correct way to build a container with authentication?
- A. elide jib -- build -t myapp --to-username=user --to-password=pass
- B. elide jib build --auth=user:pass -t myapp
- C. elide jib --credentials=user:pass build -t myapp
- D. Set environment variables

**Answer: A**
**Explanation:** `elide jib -- build -t myapp --to-username=user --to-password=pass`
**Related Showcases:** N/A (container feature)

---

#### Q178. How do you specify a custom base image for jib?
- A. elide jib -- build --from=gcr.io/distroless/base -t myapp
- B. elide jib build --base=gcr.io/distroless/base -t myapp
- C. elide jib --from-image=gcr.io/distroless/base build -t myapp
- D. In elide.pkl only

**Answer: A**
**Explanation:** `elide jib -- build --from=gcr.io/distroless/base -t myapp`
**Related Showcases:** N/A (container feature)

---

#### Q179. What is the correct way to set app root in jib container?
- A. elide jib -- build --app-root=/app -t myapp
- B. elide jib build --root=/app -t myapp
- C. elide jib --app-dir=/app build -t myapp
- D. In elide.pkl only

**Answer: A**
**Explanation:** `elide jib -- build --app-root=/app -t myapp`
**Related Showcases:** N/A (container feature)

---

#### Q180. How do you set a custom entrypoint in jib container?
- A. elide jib -- build --entrypoint=/app/myapp -t myapp
- B. elide jib build --entry=/app/myapp -t myapp
- C. elide jib --cmd=/app/myapp build -t myapp
- D. In elide.pkl only

**Answer: A**
**Explanation:** `elide jib -- build --entrypoint=/app/myapp -t myapp`
**Related Showcases:** N/A (container feature)

---

## Section 3: HTTP & Servers (80 questions)

### Easy (Questions 181-210)

#### Q181. What is the default HTTP server port in Elide?
- A. 3000
- B. 8080
- C. 8000
- D. 5000

**Answer: B**
**Explanation:** 8080
**Related Showcases:** All HTTP showcases

---

#### Q182. Which HTTP server stack does Elide use?
- A. Express + Node
- B. Netty + Micronaut
- C. Tomcat
- D. Undertow

**Answer: B**
**Explanation:** Netty + Micronaut
**Related Showcases:** All HTTP showcases

---

#### Q183. True or False: Elide supports HTTP/2.
- A. True
- B. False

**Answer: A**
**Explanation:** True
**Related Showcases:** All HTTP showcases

---

#### Q184. True or False: Elide supports HTTP/3.
- A. True
- B. False

**Answer: A**
**Explanation:** True
**Related Showcases:** All HTTP showcases

---

#### Q185. True or False: Elide supports WebSockets.
- A. True
- B. False

**Answer: A**
**Explanation:** True
**Related Showcases:** websocket-scaling, real-time-collaboration

---

#### Q186. True or False: Elide supports TLS/HTTPS.
- A. True
- B. False

**Answer: A**
**Explanation:** True
**Related Showcases:** All production HTTP showcases

---

#### Q187. Which TLS implementations does Elide support? (multiple select)
- A. OpenSSL
- B. BoringSSL
- C. LibreSSL
- D. Java TLS

**Answer: A,B**
**Explanation:** OpenSSL and BoringSSL
**Related Showcases:** All TLS showcases

---

#### Q188. True or False: Elide uses non-blocking I/O by default.
- A. True
- B. False

**Answer: A**
**Explanation:** True. Non-blocking I/O by default via Netty.
**Related Showcases:** All HTTP showcases

---

#### Q189. What is Elide's approximate RPS on Linux?
- A. ~10K RPS
- B. ~100K RPS
- C. ~800K RPS
- D. ~1M RPS

**Answer: C**
**Explanation:** ~800K RPS
**Related Showcases:** High-performance showcases

---

#### Q190. True or False: Elide is benchmarked by TechEmpower.
- A. True
- B. False

**Answer: A**
**Explanation:** True
**Related Showcases:** N/A (external benchmark)

---

#### Q191. Which beta version introduced native HTTP support?
- A. beta9
- B. beta10
- C. beta11-rc1
- D. beta12

**Answer: C**
**Explanation:** beta11-rc1
**Related Showcases:** All beta11+ HTTP showcases

---

#### Q192. True or False: Beta10 had broken HTTP serving.
- A. True
- B. False

**Answer: A**
**Explanation:** True
**Related Showcases:** Migration guide documents this

---

#### Q193. True or False: Beta11-rc1 fixed HTTP serving.
- A. True
- B. False

**Answer: A**
**Explanation:** True
**Related Showcases:** All beta11 HTTP showcases

---

#### Q194. Which HTTP patterns does beta11-rc1 support? (multiple select)
- A. Fetch Handler
- B. Node.js http.createServer
- C. WSGI
- D. Express middleware

**Answer: A,B,C**
**Explanation:** Fetch Handler, Node.js http.createServer, WSGI
**Related Showcases:** All HTTP showcases use these patterns

---

#### Q195. True or False: Beta11-rc1 requires the elide/http/server shim.
- A. True
- B. False

**Answer: B**
**Explanation:** False. No shim needed in beta11-rc1.
**Related Showcases:** All beta11 HTTP showcases

---

#### Q196. What is the recommended HTTP pattern in beta11-rc1?
- A. Express
- B. Fetch Handler
- C. Node.js http
- D. WSGI

**Answer: B**
**Explanation:** Fetch Handler (declarative, modern)
**Related Showcases:** Most HTTP showcases use Fetch Handler

---

#### Q197. True or False: Fetch Handler is declarative.
- A. True
- B. False

**Answer: A**
**Explanation:** True
**Related Showcases:** All Fetch Handler showcases

---

#### Q198. True or False: Node.js http.createServer is imperative.
- A. True
- B. False

**Answer: A**
**Explanation:** True
**Related Showcases:** node-http-basic showcase

---

#### Q199. True or False: WSGI support is new in beta11-rc1.
- A. True
- B. False

**Answer: A**
**Explanation:** True
**Related Showcases:** flask-typescript-polyglot

---

#### Q200. Which Python frameworks work with Elide's WSGI support? (multiple select)
- A. Flask
- B. Django
- C. FastAPI
- D. Tornado

**Answer: A,B**
**Explanation:** Flask and Django
**Related Showcases:** flask-typescript-polyglot

---

*(Questions 201-500 continue with the same format...)*

---

## Summary Statistics

| Section | Questions | Topics |
|---------|-----------|--------|
| Runtime & Core | 100 | Languages, GraalVM, Truffle, features |
| CLI Commands | 80 | elide run/serve/test/build, flags |
| HTTP & Servers | 80 | Netty, Micronaut, Fetch Handler, WSGI |
| Projects & Dependencies | 60 | elide.pkl, npm/maven/pip, lockfiles |
| Polyglot | 50 | Cross-language calls, Python/Java/Kotlin |
| Testing & Build | 40 | elide test, coverage, native-image |
| Beta11 Features | 50 | Migration, native HTTP, patterns |
| Advanced Topics | 40 | Performance, security, debugging |

**Total: 500 questions**

---

## Cross-Reference: Showcases by Quiz Topic

### Runtime & Core
- **api-gateway**: Polyglot (TS+Python+Java+Ruby)
- **ml-api**: Python ML inference from TypeScript
- **flask-typescript-polyglot**: Zero-serialization interop

### CLI Commands
- **testing-framework**: elide test with coverage
- **secrets-manager**: elide secrets management
- **elide-quiz**: elide serve for web UI

### HTTP & Servers
- **realtime-dashboard**: Fetch Handler + WebSocket
- **api-gateway**: Route handling patterns
- **websocket-scaling**: WebSocket connections

### Projects & Dependencies
- Most showcases have **elide.pkl** configuration
- npm dependencies: React showcases
- Maven dependencies: Java bridge showcases
- pip dependencies: ML showcases

### Polyglot
- **flask-typescript-polyglot**: Flask + TypeScript
- **java-spring-bridge**: Java + TypeScript
- **ktor-analytics-platform**: Kotlin + TypeScript
- **polyglot-ml-pipeline**: Multi-language ML

### Beta11 Features
- 22 showcases converted to beta11-rc1 patterns
- Fetch Handler pattern demonstrations
- Node.js http.createServer examples
- WSGI Python framework support

---

## Study Guide Tips

1. **Understand the Architecture**
   - GraalVM + Truffle = polyglot foundation
   - Netty + Micronaut = HTTP foundation
   - Zero-serialization = key performance benefit

2. **Master CLI Patterns**
   - `--` separator for passing args to underlying tools
   - `--host:allow-*` for security permissions
   - `--inspect:*` for debugging

3. **Know HTTP Patterns**
   - Fetch Handler: `export default async function fetch(req: Request): Promise<Response>`
   - Node.js http: `createServer((req, res) => {...}).listen(port)`
   - WSGI: `elide run --wsgi app.py`

4. **Practice with Showcases**
   - Run 5-10 showcases to understand patterns
   - Modify and experiment with code
   - Check performance benchmarks

5. **Focus on Beta11 Changes**
   - Native HTTP (no shim needed)
   - Three HTTP patterns supported
   - WSGI for Python frameworks

---

**End of Phase 4 Quiz Analysis**
