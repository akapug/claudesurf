# WHIPLASH Crate Catalog - PHASE 1
## Complete Exhaustive Analysis of All 22 Crates

Generated: 2026-01-11
Agent: eval-control-20260110-215008

---

## Table of Contents

1. [base](#crate-base)
2. [bindings](#crate-bindings)
3. [builder](#crate-builder)
4. [cache](#crate-cache)
5. [cli](#crate-cli)
6. [core](#crate-core)
7. [db](#crate-db)
8. [diag](#crate-diag)
9. [dns](#crate-dns)
10. [http](#crate-http)
11. [js](#crate-js)
12. [licensing](#crate-licensing)
13. [macros](#crate-macros)
14. [o11y](#crate-o11y)
15. [rpc](#crate-rpc)
16. [runtime](#crate-runtime)
17. [sidecar](#crate-sidecar)
18. [sys](#crate-sys)
19. [telemetry](#crate-telemetry)
20. [terminal](#crate-terminal)
21. [transport](#crate-transport)
22. [web](#crate-web)

---

## Crate: base

### Imports (verbatim)
```rust
// No external imports at crate root - uses internal modules
```

### Module Documentation
```rust
//! Base crate with primitive types and other useful utilities.
//!
//! This crate is used by all higher-level crates and should have minimal dependencies.
```

### Public Items

#### Module: `pub mod cfg`
```rust
/// The `cfg` mod exports public constants known at build-time.
pub mod cfg;
```

#### Module: `pub mod prelude`
```rust
/// The `prelude` mod prepares common imports and exports.
pub mod prelude;
```

#### Module: `pub mod init`
```rust
/// Initialization tools and helpers.
pub mod init;
```

#### Re-export: `inventory`
```rust
/// Re-export inventory for use in generated code (users shouldn't need to add inventory as a dep)
#[doc(hidden)]
pub use bindings::inventory;
```

#### Re-export: Binding types
```rust
/// Re-export binding types used in generated code.
pub use bindings::{InitError, InitResult, InitStatus, NativeBinding, NativeCall, OnInitBinding};
```

#### Conditional Re-export: JNI
```rust
/// Re-export JNI types expected in generated code.
#[cfg(feature = "jni")]
pub use jni;
```

### Full Source (39 lines)
```rust
/*
 * Copyright (c) 2025 Elide Technologies, Inc. All Rights Reserved.
 *
 * PROPRIETARY AND CONFIDENTIAL. This software may contain trade secrets and
 * confidential information of Elide Technologies, Inc.
 *
 * UNAUTHORIZED USE, COPYING, DISTRIBUTION, OR DISCLOSURE IS STRICTLY PROHIBITED.
 * No part of this software may be shared without prior written consent from
 * Elide Technologies, Inc.
 *
 * Contact: engineering@elide.dev
 */

//! Base crate with primitive types and other useful utilities.
//!
//! This crate is used by all higher-level crates and should have minimal dependencies.

#![forbid(unsafe_code)]

/// The `cfg` mod exports public constants known at build-time.
pub mod cfg;

/// The `prelude` mod prepares common imports and exports.
pub mod prelude;

/// Initialization tools and helpers.
pub mod init;

/// Re-export inventory for use in generated code (users shouldn't need to add inventory as a dep)
#[doc(hidden)]
pub use bindings::inventory;

/// Re-export binding types used in generated code.
pub use bindings::{InitError, InitResult, InitStatus, NativeBinding, NativeCall, OnInitBinding};

/// Re-export JNI types expected in generated code.
#[cfg(feature = "jni")]
pub use jni;
```

---

## Crate: bindings

### Imports (verbatim)
```rust
// 3p crates.
use anyhow::Result;

use crate::prelude::*;
```

### Module Documentation
```rust
//! Native bindings to Elide through JNI and Native Image C API.
//!
//! This crate provides a layer which accepts native calls from JVM contexts; such calls may be performed over several
//! distinct mechanisms, including dynamic JNI, static JNI, GraalVM Native Image C API, and Panama.
//!
//! Generally speaking, bindings provide some kind of native functionality to the VM, whether internal or guest-facing.
//! Calls are formulated and dispatched from JVM into native code, where a `NativeCall` context is provided to the
//! callee. In JNI contexts, the JNI environment and class references may be obtained through this interface.
//!
//! In non-JNI contexts, the JNI environment and class references may or may not be available.
```

### Public Items

#### Module: `pub mod prelude`
```rust
// Export our own prelude.
pub mod prelude;
```

#### Re-export: Macros
```rust
// Re-export macros for function bindings and initialization.
pub use macros::{bind, on_init};
```

#### Re-export: inventory
```rust
// Re-export inventory for use in generated code (users shouldn't need to add inventory as a dep)
#[doc(hidden)]
pub use inventory;
```

#### Struct: `NativeCall<'a>`
```rust
/// Context provided to native functions, containing optional JNI environment access.
///
/// When a function is called from JNI, this struct contains references to the
/// JNI environment and class. When called from C/FFI or other contexts, these
/// fields are `None`.
///
/// # Example
///
/// ```ignore
/// use base::{bind, NativeCall};
///
/// #[bind("com.example.Native", "greet")]
/// pub fn greet(call: NativeCall, name_ptr: *const u8, name_len: usize) -> i32 {
///     // Check if we're in a JNI context
///     if call.is_jni() {
///         // Can access JNI env for Java-specific operations
///     }
///     0
/// }
/// ```
#[derive(Debug)]
pub struct NativeCall<'a> {
  /// The JNI environment, if called from JNI context.
  #[cfg(feature = "jni")]
  env: Option<JNIEnv<'a>>,

  /// The JNI class, if called from JNI context.
  #[cfg(feature = "jni")]
  class: Option<JClass<'a>>,

  /// Phantom lifetime when JNI feature is disabled.
  #[cfg(not(feature = "jni"))]
  _phantom: std::marker::PhantomData<&'a ()>,
}
```

#### Impl: `NativeCall<'a>` methods (first 20 lines)
```rust
impl<'a> NativeCall<'a> {
  /// Creates an empty `NativeCall` for non-JNI contexts.
  #[inline]
  #[must_use]
  pub fn empty() -> Self {
    Self {
      #[cfg(feature = "jni")]
      env: None,
      #[cfg(feature = "jni")]
      class: None,
      #[cfg(not(feature = "jni"))]
      _phantom: std::marker::PhantomData,
    }
  }

  /// Creates a `NativeCall` from JNI environment and class.
  #[cfg(feature = "jni")]
  #[inline]
  #[must_use]
```

#### Struct: `NativeBinding`
```rust
/// Metadata about a registered native binding.
///
/// This struct is automatically populated by the `#[bind]` macro and registered
/// with the `inventory` crate for runtime discovery.
#[derive(Debug, Clone)]
pub struct NativeBinding {
  /// Original Rust function name.
  pub name: &'static str,

  /// Exported C-ABI function name (used for Panama, Native Image, etc.).
  pub export_name: &'static str,

  /// JNI class path (e.g., "com.example.Native").
  pub jni_class: &'static str,

  /// Full JNI path including method name (e.g., "com.example.Native.doSomething").
  pub jni_path: &'static str,

  /// Mangled JNI function name (e.g., "Java_com_example_Native_doSomething").
  pub jni_name: &'static str,

  /// JNI method signature (e.g., "(II)I").
  pub signature: &'static str,

  /// Source file where the binding is defined.
  pub source_file: &'static str,

  /// Source line number where the binding is defined.
  pub source_line: u32,
}
```

#### Function: `pub fn bindings() -> impl Iterator<Item = &'static NativeBinding>`
```rust
/// Returns an iterator over all registered native bindings.
///
/// # Example
///
/// ```ignore
/// for binding in base::bindings() {
///     println!("Found binding: {} -> {}", binding.name, binding.jni_name);
/// }
/// ```
#[inline]
pub fn bindings() -> impl Iterator<Item = &'static NativeBinding> {
  inventory::iter::<NativeBinding>.into_iter()
}
```

#### Function: `pub fn binding_count() -> usize`
```rust
/// Returns the number of registered native bindings.
#[inline]
#[must_use]
pub fn binding_count() -> usize {
  inventory::iter::<NativeBinding>.into_iter().count()
}
```

#### Function: `pub fn find_by_name(name: &str) -> Option<&'static NativeBinding>`
```rust
/// Finds a binding by its original Rust function name.
#[must_use]
pub fn find_by_name(name: &str) -> Option<&'static NativeBinding> {
  bindings().find(|b| b.name == name)
}
```

#### Function: `pub fn find_by_export_name(export_name: &str) -> Option<&'static NativeBinding>`
```rust
/// Finds a binding by its exported C-ABI name.
#[must_use]
pub fn find_by_export_name(export_name: &str) -> Option<&'static NativeBinding> {
  bindings().find(|b| b.export_name == export_name)
}
```

#### Function: `pub fn find_by_jni_name(jni_name: &str) -> Option<&'static NativeBinding>`
```rust
/// Finds a binding by its JNI function name.
#[must_use]
pub fn find_by_jni_name(jni_name: &str) -> Option<&'static NativeBinding> {
  bindings().find(|b| b.jni_name == jni_name)
}
```

#### Function: `pub fn find_by_class(jni_class: &str) -> impl Iterator<Item = &'static NativeBinding> + '_`
```rust
/// Finds all bindings for a given JNI class.
pub fn find_by_class(jni_class: &str) -> impl Iterator<Item = &'static NativeBinding> + '_ {
  bindings().filter(move |b| b.jni_class == jni_class)
}
```

#### Struct: `InitStatus`
```rust
/// Result of an initialization function.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct InitStatus {
  /// Sentinel value indicating success (0) or specific status code.
  pub code: i32,
}

impl InitStatus {
  /// Successfully initialized (code 0).
  pub const SUCCESS: Self = Self { code: 0 };

  /// Create a custom status code.
  #[inline]
  #[must_use]
  pub const fn with_code(code: i32) -> Self {
    Self { code }
  }

  /// Returns true if initialization succeeded.
  #[inline]
  #[must_use]
  pub const fn is_success(&self) -> bool {
    self.code == 0
  }
}
```

#### Struct: `InitError`
```rust
/// Error that can occur during initialization.
#[derive(Debug, Clone)]
pub struct InitError {
  /// Error message.
  pub message: &'static str,

  /// Optional error code.
  pub code: Option<i32>,
}

impl InitError {
  /// Create a new initialization error with a message.
  #[inline]
  #[must_use]
  pub const fn new(message: &'static str) -> Self {
    Self {
      message,
      code: None,
    }
  }

  /// Create a new initialization error with a message and code.
  #[inline]
  #[must_use]
  pub const fn with_code(message: &'static str, code: i32) -> Self {
    Self {
      message,
      code: Some(code),
    }
  }
}
```

#### Type Alias: `InitResult`
```rust
/// Result type for initialization functions.
pub type InitResult = Result<InitStatus, InitError>;
```

#### Struct: `OnInitBinding`
```rust
/// Metadata about a registered initialization function.
///
/// This struct is automatically populated by the `#[on_init]` macro and registered
/// with the `inventory` crate for runtime discovery.
///
/// Initialization functions registered with `#[on_init]` are similar to JNI's `OnLoad`
/// but can work in both static and dynamic contexts.
#[derive(Debug, Clone)]
pub struct OnInitBinding {
  /// Original Rust function name.
  pub name: &'static str,

  /// Source file where the binding is defined.
  pub source_file: &'static str,

  /// Source line number where the binding is defined.
  pub source_line: u32,

  /// The actual function pointer to call during initialization.
  /// Takes a reference to NativeCall parameter.
  pub init_fn: fn(&NativeCall) -> InitResult,
}
```

#### Function: `pub fn init_bindings() -> impl Iterator<Item = &'static OnInitBinding>`
```rust
/// Returns an iterator over all registered initialization functions.
#[inline]
pub fn init_bindings() -> impl Iterator<Item = &'static OnInitBinding> {
  inventory::iter::<OnInitBinding>.into_iter()
}
```

#### Function: `pub fn invoke_all_init() -> InitResult`
```rust
/// Invokes all registered initialization functions in order.
///
/// Returns `Ok(())` if all initialization functions succeeded, or the first error encountered.
pub fn invoke_all_init() -> InitResult {
  for binding in init_bindings() {
    binding.invoke()?;
  }
  Ok(InitStatus::SUCCESS)
}
```

#### Function: `pub fn invoke_all_init_with(call: &NativeCall) -> InitResult`
```rust
/// Invokes all registered initialization functions with a specific NativeCall context.
///
/// Returns `Ok(())` if all initialization functions succeeded, or the first error encountered.
pub fn invoke_all_init_with(call: &NativeCall) -> InitResult {
  for binding in init_bindings() {
    binding.invoke_with(call)?;
  }
  Ok(InitStatus::SUCCESS)
}
```

---

## Crate: builder

### Imports (verbatim)
```rust
use bindgen::Builder;
use cc::Build;
use serde::{Deserialize, Serialize};
use std::env;
use std::env::var;
use std::env::var_os;
use std::path::{Path, PathBuf};
```

### Constants
```rust
// Constants used for build profiles.
const DEBUG: &str = "debug";
const RELEASE: &str = "release";

// Constants used for OS identification.
const DARWIN: &str = "darwin";
const LINUX: &str = "linux";
const WINDOWS: &str = "windows";

// Constants used for architecture identification.
const AMD64: &str = "amd64";
const ARM64: &str = "aarch64";

/// Library to link to for mimalloc.
const MIMALLOC_PATH: &str = "mimalloc-2.2";

/// Minimum supported version of macOS.
pub const MACOS_MIN: &str = "11.0";

/// Target x86-64 architecture.
const ARCH_TARGET_X86_64: &str = "x86-64-v3";

/// Target ARM64 architecture.
const ARCH_TARGET_ARM64: &str = "armv8-a+crypto+crc+simd";

/// macOS deployment target.
const MACOS_DEPLOYMENT_TARGET: &str = "11.0";

/// Common C flags applied to all builds which use this builder interface.
const COMMON_C_FLAGS: [&str; 14] = [
  "-g",
  "-O3",
  "-fPIC",
  "-fPIE",
  "-fstack-clash-protection",
  "-fstack-protector-strong",
  "-fexceptions",
  "-ffunction-sections",
  "-fdata-sections",
  "-fno-omit-frame-pointer",
  "-fno-delete-null-pointer-checks",
  "-fno-strict-overflow",
  "-fno-strict-aliasing",
  "-DELIDE",
];

/// Common ASM flags applied to all builds which use this builder interface.
const COMMON_ASM_FLAGS: [&str; 1] = ["--noexecstack"];
```

### Public Items

#### Enum: `BuildMode`
```rust
/// Enumerates the types of build profiles which Elide supports.
#[derive(Debug, Serialize, Deserialize, PartialEq, Eq)]
pub enum BuildMode {
  Debug,
  Release,
}

impl BuildMode {
  pub const fn as_str(&self) -> &'static str {
    match self {
      BuildMode::Debug => DEBUG,
      BuildMode::Release => RELEASE,
    }
  }

  pub const fn current() -> Self {
    if cfg!(debug_assertions) {
      BuildMode::Debug
    } else {
      BuildMode::Release
    }
  }
}
```

#### Enum: `OperatingSystem`
```rust
/// Enumerates supported operating systems.
#[derive(Debug, Serialize, Deserialize, PartialEq, Eq)]
pub enum OperatingSystem {
  Darwin,
  Linux,
  Windows,
}

impl OperatingSystem {
  pub const fn as_str(&self) -> &'static str {
    match self {
      OperatingSystem::Darwin => DARWIN,
      OperatingSystem::Linux => LINUX,
      OperatingSystem::Windows => WINDOWS,
    }
  }

  pub const fn current() -> Self {
    if cfg!(windows) {
      OperatingSystem::Windows
    } else if cfg!(target_os = "macos") {
      OperatingSystem::Darwin
    } else {
      OperatingSystem::Linux
    }
  }
}
```

#### Enum: `Architecture`
```rust
/// Enumerates supported target architectures.
#[derive(Debug, Serialize, Deserialize, PartialEq, Eq)]
pub enum Architecture {
  Amd64,
  Arm64, // alias for aarch64 on applicable platforms
}

impl Architecture {
  pub const fn as_str(&self) -> &'static str {
    match self {
      Architecture::Amd64 => AMD64,
      Architecture::Arm64 => ARM64,
    }
  }

  pub const fn current() -> Self {
    if cfg!(target_arch = "x86_64") {
      Architecture::Amd64
    } else {
      Architecture::Arm64
    }
  }
}
```

#### Struct: `HostInfo`
```rust
/// Host Info.
///
/// Describes information about the host which Elide was built for; this information is assembled at compile-time.
#[derive(Debug, Serialize, Deserialize, PartialEq, Eq)]
pub struct HostInfo {
  /// Operating system of the host.
  pub os: OperatingSystem,

  /// Architecture of the host.
  pub arch: Architecture,
}
```

#### Struct: `ElideInfo`
```rust
/// Elide Info.
///
/// Compile-time information about the current build of Elide, including the active version, target, engines, build
/// profile, and so on.
#[derive(Debug, Serialize, Deserialize, PartialEq, Eq)]
pub struct ElideInfo {
  /// Information about the host OS and architecture which this build of Elide targets.
  pub host: HostInfo,
}
```

#### Struct: `ToolchainMetadata`
```rust
/// Toolchain metadata read from .toolchain.json
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ToolchainMetadata {
  pub name: String,
  pub home_path: String,
  pub bin_path: String,
  pub checksum: String,
  pub installed_at: String,
}
```

#### Struct: `BuilderConfig`
```rust
/// Configuration for the builder environment.
pub struct BuilderConfig {
  /// Root path of the project.
  pub root: PathBuf,

  /// GraalVM home path.
  pub graalvm_home: PathBuf,
}
```

#### Function: `pub fn project_root() -> PathBuf`
```rust
/// Retrieve the root path to the project.
pub fn project_root() -> PathBuf {
  let basecrate = env::current_dir().unwrap();
  basecrate.parent().unwrap().parent().unwrap().to_path_buf()
}
```

#### Function: `pub fn java_home() -> PathBuf`
```rust
/// Retrieve the `JAVA_HOME` path.
///
/// First checks for a managed GraalVM toolchain at `.dev/toolchains/gvm`,
/// then falls back to the `JAVA_HOME` environment variable.
pub fn java_home() -> PathBuf {
  // First check for managed GraalVM toolchain
  if let Some(managed) = managed_toolchain_home("gvm") {
    return managed;
  }
  // Fallback to environment variable
  let java_home = std::env::var("JAVA_HOME").expect(
    "JAVA_HOME environment variable is not set and no managed GraalVM toolchain found.\n\
     Run: builder toolchains install gvm",
  );
  Path::new(&java_home).to_path_buf()
}
```

#### Function: `pub fn graalvm_home() -> PathBuf`
```rust
/// Retrieve the `GRAALVM_HOME` path.
///
/// First checks for a managed GraalVM toolchain at `.dev/toolchains/gvm`,
/// then falls back to `GRAALVM_HOME` or `JAVA_HOME` environment variables.
pub fn graalvm_home() -> PathBuf {
  // First check for managed GraalVM toolchain
  if let Some(managed) = managed_toolchain_home("gvm") {
    return managed;
  }
  // Then check environment variables
  let graalvm_home = std::env::var("GRAALVM_HOME");
  match graalvm_home {
    Ok(path) => Path::new(&path).to_path_buf(),
    Err(_) => {
      // fallback to JAVA_HOME
      java_home()
    }
  }
}
```

#### Function: `pub fn setup_cc() -> Build`
```rust
/// Setup a consistent C compiler build environment.
pub fn setup_cc() -> Build {
  let profile = var("PROFILE").unwrap();
  let os = target_os();
  let arch = target_arch();
  let mut build = Build::new();
  let custom_cc = var("CC");
  if let Ok(cc) = custom_cc {
    build.compiler(cc.clone());
  }
  build
    // Defines & Compiler Settings
    .pic(true)
    .use_plt(false);
  // ... continues with comprehensive build configuration
```

#### Function: `pub fn prepare_builder_environment() -> BuilderConfig`
```rust
/// Prepare a uniform builder environment for a crate; this method should be called in a `build.rs` script, after which
/// environment variables and compiler configuration are considered established.
pub fn prepare_builder_environment() -> BuilderConfig {
  // make sure we are not interfering with rust flags
  check_no_rustflags();

  // ensure `PROJECT_ROOT` is set
  let root = project_root();
  println!("cargo:rustc-env=PROJECT_ROOT={}", root.display());

  // ensure `GRAALVM_HOME` is set
  let graalvm_home = graalvm_home();
  println!("cargo:rustc-env=GRAALVM_HOME={}", graalvm_home.display());

  // ensure `JAVA_HOME` is set to `GRAALVM_HOME`
  println!("cargo:rustc-env=JAVA_HOME={}", graalvm_home.display());

  // ensure `ARTIFACTS_DIR` is set
  let artifacts_dir = artifacts_path();
  println!("cargo:rustc-env=ARTIFACTS_DIR={}", artifacts_dir.display());

  inject_env();

  BuilderConfig { root, graalvm_home }
}
```

---

## Crate: cache

### Full Source (15 lines - stub crate)
```rust
/*
 * Copyright (c) 2025 Elide Technologies, Inc. All Rights Reserved.
 *
 * PROPRIETARY AND CONFIDENTIAL. This software may contain trade secrets and
 * confidential information of Elide Technologies, Inc.
 *
 * UNAUTHORIZED USE, COPYING, DISTRIBUTION, OR DISCLOSURE IS STRICTLY PROHIBITED.
 * No part of this software may be shared without prior written consent from
 * Elide Technologies, Inc.
 *
 * Contact: engineering@elide.dev
 */

// Nothing yet.
```

---

## Crate: cli

### Imports (verbatim)
```rust
use ::std::ffi::OsString;
use ::std::fmt;
use ::std::fmt::Formatter;
use clap::{Parser, Subcommand};
use elidesys::prelude::*;
```

### Module Documentation
```rust
//! Native command-line interface (CLI) for Elide.
//!
//! This crate parses arguments and formulates a command structure during an invocation of Elide from the command line.
```

### Private Modules
```rust
/// Shared structures across commands.
mod commons;

// Top-level commands.
/// Init command.
mod init;
/// Info command.
mod info;
/// Run command.
mod run;
/// Serve command.
mod serve;
/// Build command.
mod build;
/// Test command.
mod test;
/// Dev command.
mod dev;
/// Format command.
mod format;
/// Language Server Protocol (LSP) server command.
mod lsp;
/// Model Context Protocol (MCP) server command.
mod mcp;
/// Project command.
mod project;
/// Install command.
mod install;
/// Classpath command.
mod classpath;
/// Licensing commands.
mod pro;

// Servers and other utilities.
/// Embedded Kotlin compiler.
mod s3;

// Embedded tools.
/// Embedded Java runner.
mod java;
/// Embedded Java compiler.
mod javac;
/// Embedded Java disassembler.
mod javap;
/// Embedded Java compiler.
mod javadoc;
/// Embedded Kotlin compiler.
mod kotlinc;
/// Embedded Java formatter.
mod javaformat;
/// Embedded Kotlin formatter.
mod ktfmt;
/// Embedded Java compiler.
mod native_image;
/// Embedded JAR packager.
mod jar;
/// Embedded container builder.
mod jib;

// Internal-only commands.
/// Sidecar binary launch/manage.
mod sidecar;
```

### Public Re-exports
```rust
pub use crate::build::*;
pub use crate::classpath::*;
pub use crate::dev::*;
pub use crate::format::*;
pub use crate::info::*;
pub use crate::init::*;
pub use crate::install::*;
pub use crate::jar::*;
pub use crate::java::*;
pub use crate::javac::*;
pub use crate::javadoc::*;
pub use crate::javaformat::*;
pub use crate::javap::*;
pub use crate::jib::*;
pub use crate::kotlinc::*;
pub use crate::ktfmt::*;
pub use crate::lsp::*;
pub use crate::mcp::*;
pub use crate::native_image::*;
pub use crate::pro::*;
pub use crate::project::*;
pub use crate::run::*;
pub use crate::s3::*;
pub use crate::serve::*;
pub use crate::sidecar::*;
pub use crate::test::*;
```

### Public Items

#### Struct: `ElideCli`
```rust
/// Main command line interface for Elide.
#[derive(Parser, Debug)]
#[command(version, about, author, long_about = None, propagate_version = true, args_conflicts_with_subcommands = false)]
pub struct ElideCli {
  /// Sets a custom config file
  #[arg(short, long, global = true, value_name = "FILE")]
  pub config: Option<PathBuf>,

  /// Turn debugging information on
  #[arg(short, long, global = true, action = clap::ArgAction::Count)]
  pub debug: u8,

  /// Quiet output mode
  #[arg(short, long, global = true)]
  pub quiet: bool,

  /// Force color mode
  #[arg(long, global = true)]
  pub color: bool,

  /// Force no-color mode
  #[arg(long, global = true)]
  pub no_color: bool,

  /// Immediately crash (for testing)
  #[arg(long, global = true)]
  pub crash: bool,

  /// Allow or disallow native access
  #[arg(long, global = true)]
  pub no_native: bool,

  /// Disallow telemetry; has no effect if unlicensed.
  #[arg(long, global = true)]
  pub no_telemetry: bool,

  /// Path to a specific project directory to load and use.
  #[arg(short = 'p', long = "project", global = true, value_name = "path")]
  pub project: Option<String>,

  /// File to run (top-level/no command).
  #[arg(value_name = "FILE")]
  pub file: Option<PathBuf>,

  /// Code snippet to run (top-level/no command).
  #[arg(short = 's', long = "snippet", value_name = "CODE")]
  pub code: Option<String>,

  /// Arguments to pass to the script under execution, separated by e.g. `--`.
  #[arg(last = true)]
  pub script_args: Vec<String>,

  /// Command which is under execution.
  #[command(subcommand)]
  pub command: Option<ElideCommands>,
}
```

#### Enum: `ElideCommands`
```rust
/// Commands supported by Elide.
#[derive(Subcommand, Debug)]
pub enum ElideCommands {
  // ---- Top-level commands.
  /// Initialize a new Elide project.
  Init(InitArgs),
  /// Prints information about Elide's build and environment.
  Info(InfoArgs),
  /// Run a thing.
  Run(RunArgs),
  /// Serve a thing.
  Serve(ServeArgs),
  /// Build a thing.
  Build(BuildArgs),
  /// Test a thing.
  Test(TestArgs),
  /// Develop a thing.
  Dev(DevArgs),
  /// Format code.
  Format(FormatArgs),
  /// Project info and management.
  Project(ProjectArgs),
  /// Print classpaths.
  Classpath(ClasspathArgs),
  /// Install dependencies.
  Install(InstallArgs),
  /// Run an LSP server.
  Lsp(LspArgs),
  /// Run an MCP server, or invoke an MCP command.
  Mcp(McpArgs),

  // ---- Embedded tools.
  /// Java runner.
  Java(JavaArgs),
  /// Java compiler.
  Javac(JavacArgs),
  /// Java disassembler.
  Javap(JavapArgs),
  /// Javadoc compiler.
  Javadoc(JavadocArgs),
  /// Kotlin compiler.
  Kotlinc(KotlincArgs),
  /// Native Image compiler.
  NativeImage(NativeImageArgs),
  /// Jar packaging.
  Jar(JarArgs),
  /// Jib builder.
  Jib(JibArgs),
  /// Java formatter.
  Javaformat(JavaFormatArgs),
  /// Kotlin formatter.
  Ktfmt(KtfmtArgs),

  // ---- Licensing commands.
  /// Top-level licensing command.
  Pro(ProArgs),

  // ---- Internal commands.
  /// Launch or manage the sidecar process.
  Sidecar(SidecarArgs),
}
```

#### Struct: `ReadyCli`
```rust
#[derive(Debug)]
pub struct ReadyCli {
  pub cli: ElideCli,
  pub expanded: Vec<OsString>,
}
```

#### Function: `pub fn try_parse_cli() -> Result<ElideCli, clap::Error>`
```rust
/// Parse CLI flags according to Elide's CLI structure.
#[inline]
pub fn try_parse_cli() -> Result<ElideCli, clap::Error> {
  ElideCli::try_parse()
}
```

#### Function: `pub fn try_parse_cli_from_os_args<I, T>(args: I) -> Result<ReadyCli, clap::Error>`
```rust
/// Parse CLI flags from an iterator of arguments.
#[inline]
pub fn try_parse_cli_from_os_args<I, T>(args: I) -> Result<ReadyCli, clap::Error>
where
  I: IntoIterator<Item = T>,
  T: Into<OsString> + Clone,
{
  if cfg!(feature = "debug-init") {
    eprintln!("original: {:?}", ::std::env::args_os().collect::<Vec<_>>());
  }

  // wildcard expansion
  let expanded: Vec<OsString> = if cfg!(target_os = "windows") {
    wild::args_os().collect()
  } else {
    args.into_iter().map(|a| a.into()).collect()
  };

  // argfile expansion
  let expanded = argfile::expand_args_from(
    expanded.into_iter(),
    argfile::parse_fromfile,
    argfile::PREFIX,
  )
  .unwrap();

  let effective = ElideCli::try_parse_from(&expanded);
  effective.map(|cli| ReadyCli { cli, expanded })
}
```

---

## Crate: core

### Full Source (50 lines)
```rust
/*
 * Copyright (c) 2025 Elide Technologies, Inc. All Rights Reserved.
 *
 * PROPRIETARY AND CONFIDENTIAL. This software may contain trade secrets and
 * confidential information of Elide Technologies, Inc.
 *
 * UNAUTHORIZED USE, COPYING, DISTRIBUTION, OR DISCLOSURE IS STRICTLY PROHIBITED.
 * No part of this software may be shared without prior written consent from
 * Elide Technologies, Inc.
 *
 * Contact: engineering@elide.dev
 */

//! Provides core runtime functionality for Elide's native side.
//!
//! This crate provides essential runtime features, including memory allocation facilities, Tokio runtime access and
//! management, and certain utilities for OS interaction.

// External allocator access to Mimalloc.
#[cfg(all(target_os = "linux", target_env = "musl"))]
#[cfg(all(feature = "mimalloc", feature = "mimalloc-static"))]
pub mod allocator;

// Export the allocator to use.
#[cfg(all(target_os = "linux", target_env = "musl"))]
#[cfg(all(feature = "mimalloc", feature = "mimalloc-static"))]
pub use allocator::MiMallocExtern;

/// Extended prelude.
pub mod prelude;

use elidebase::prelude::*;

#[on_init]
pub fn initialize_runtime_with_call(call: &NativeCall) -> InitResult {
  // Check if we're in a JNI context
  if call.is_jni() {
    // Perform JNI-specific initialization
  }

  // Perform common initialization
  Ok(InitStatus::SUCCESS)
}

#[on_init]
pub fn initialize_runtime_simple() -> InitResult {
  // Simple initialization without NativeCall
  Ok(InitStatus::SUCCESS)
}
```

---

## Crate: db

### Imports (verbatim)
```rust
use core::ffi::c_void;
use java_native::{jni, on_load, on_unload};
use sqlite3::*;
```

### Module Documentation
```rust
//! Native database functionality.
//!
//! This crate provides integration with SQL and non-SQL databases, including KV-style storage and SQLite, as well as
//! other adapters.
```

### Private Modules
```rust
/// Generated SQLite3 bindings.
mod sqlite3;
```

### Public Items

#### Function: `pub unsafe fn on_load_static(vm: *mut JavaVM, reserved: *mut c_void) -> jint`
```rust
#[cfg(not(feature = "dynamic"))]
#[on_load("sqlite3elide")]
pub unsafe fn on_load_static(vm: *mut JavaVM, reserved: *mut c_void) -> jint {
  unsafe { sqlite_on_load(vm, reserved) }
}
```

#### Function: `pub unsafe fn on_unload_static(vm: *mut JavaVM, reserved: *mut c_void)`
```rust
#[cfg(not(feature = "dynamic"))]
#[on_unload("sqlite3elide")]
pub unsafe fn on_unload_static(vm: *mut JavaVM, reserved: *mut c_void) {
  unsafe { sqlite_on_unload(vm, reserved) }
}
```

#### JNI Bindings (SQLite operations - 70+ functions)
```rust
/// Determine if the SQLite library is operating in static JNI mode.
#[jni("org.sqlite.core.NativeDB")]
pub unsafe fn isStatic(env: *mut JNIEnv, this: *mut c_void) -> jint {
  unsafe { sqlite_isStatic(env, this) }
}

/// Initialize the SQLite library.
#[jni("org.sqlite.core.NativeDB")]
pub unsafe fn initializeStatic(env: *mut JNIEnv, this: *mut c_void) -> jint {
  unsafe { sqlite_initializeStatic(env, this) }
}

#[jni("org.sqlite.core.NativeDB")]
pub unsafe fn openUtf8(env: *mut JNIEnv, this: jobject, jfilename: jbyteArray, flags: jint) {
  unsafe { sqlite__1open_1utf8(env, this, jfilename, flags) }
}

#[jni("org.sqlite.core.NativeDB")]
pub unsafe fn _close(env: *mut JNIEnv, this: jobject) {
  unsafe { sqlite__1close(env, this) }
}

#[jni("org.sqlite.core.NativeDB")]
pub unsafe fn _exec_utf8(env: *mut JNIEnv, this: jobject, jsql: jbyteArray) -> jint {
  unsafe { sqlite__1exec_1utf8(env, this, jsql) }
}

// ... continues with 65+ more SQLite JNI bindings including:
// - shared_cache, enable_load_extension, interrupt, busy_timeout, busy_handler
// - prepare_utf8, errmsg_utf8, libversion_utf8
// - changes, total_changes, finalize, step, reset, clear_bindings
// - bind_parameter_count, column_count, column_type, column_decltype_utf8
// - column_table_name_utf8, column_name_utf8, column_text_utf8, column_blob
// - column_double, column_long, column_int
// - bind_null, bind_int, bind_long, bind_double, bind_text_utf8, bind_blob
// - result_null, result_text_utf8, result_blob, result_double, result_long, result_int, result_error_utf8
// - value_text_utf8, value_blob, value_double, value_long, value_int, value_type
// - create_function_utf8, destroy_function_utf8, create_collation_utf8, destroy_collation_utf8
// - limit, backup, restore, column_metadata
// - set_commit_listener, set_update_listener
// - register_progress_handler, clear_progress_handler
// - serialize, deserialize
```

---

## Crate: diag

### Imports (verbatim)
```rust
use java_native::jni;
use jni::JNIEnv;
use jni::objects::{JClass, JObject, JValue};
```

### Constants
```rust
// Class name for the diagnostics reporter.
static CLS_DIAGNOSTICS_REPORTER: &str = "dev/elide/runtime/diag/NativeDiagnostics";

// Method signature which accepts an array of `elide/runtime/diag/DiagnosticInfo` objects.
static METHOD_SIG_REPORT_DIAGNOSTICS: &str = "(Ldev/elide/runtime/diag/DiagnosticInfo;)V";

// Name of the class which hosts a mutable diagnostic record.
static DIAGNOSTIC_CLASS_NAME: &str = "dev/elide/runtime/diag/MutableDiagnostic";
```

### Public Items

#### Enum: `Severity`
```rust
/// Diagnostic severity.
///
/// Maps across different types of severity from various tools. Equivalent in JVM is: `elide.runtime.diag.Severity`.
#[derive(Copy, Debug, Clone, Default)]
pub enum Severity {
  #[default]
  Info = 0,
  Warn = 1,
  Error = 2,
}
```

#### Enum: `DiagnosticError`
```rust
#[derive(Debug)]
pub enum DiagnosticError {
  Fail = -1,
}
```

#### Struct: `MutableDiagnostic`
```rust
/// Mutable diagnostic record.
///
/// Used for building diagnostic information from native contexts; backed by a Java object.
#[derive(Debug, Default)]
pub struct MutableDiagnostic {
  /// Severity for this diagnostic.
  severity: Severity,

  /// Language which relates to this diagnostic, as applicable.
  lang: Option<String>,

  /// Tool that reported this diagnostic, if known/applicable.
  tool: Option<String>,

  /// Message for this diagnostic.
  message: Option<String>,

  /// Advice for this diagnostic.
  advice: Option<String>,
}
```

#### Trait: `DiagnosticBuilder`
```rust
/// Describes the structure of a mutable diagnostic builder.
pub trait DiagnosticBuilder {
  /// Set the language tag value for this diagnostic.
  fn with_lang(&mut self, advice: &str) -> &mut Self;

  /// Set the tool tag value for this diagnostic.
  fn with_tool(&mut self, advice: &str) -> &mut Self;

  /// Set the message for this diagnostic.
  fn with_message(&mut self, message: &str) -> &mut Self;

  /// Set the advice value for this diagnostic.
  fn with_advice(&mut self, advice: &str) -> &mut Self;

  /// Set the `Severity` level for this diagnostic.
  fn with_severity(&mut self, severity: Severity) -> &mut Self;

  /// Build the final diagnostic record.
  fn build<'a>(&self, env: &mut JNIEnv<'a>) -> Result<JObject<'a>, DiagnosticError>;
}
```

#### Function: `pub fn create_diagnostic() -> MutableDiagnostic`
```rust
/// Diagnostic record.
///
/// Builder for an eventual finalized diagnostic record. Equivalent in JVM is: `elide.runtime.diag.MutableDiagnostic`.
pub fn create_diagnostic() -> MutableDiagnostic {
  MutableDiagnostic::default()
}
```

#### Function: `pub fn report_diagnostic(env: &mut JNIEnv, builder: MutableDiagnostic) -> Result<(), DiagnosticError>`
```rust
/// Report an un-built diagnostic record.
pub fn report_diagnostic(
  env: &mut JNIEnv,
  builder: MutableDiagnostic,
) -> Result<(), DiagnosticError> {
  let rec = builder
    .build(env)
    .expect("failed to build diagnostic record");

  let jcls = env
    .find_class(CLS_DIAGNOSTICS_REPORTER)
    .unwrap_or_else(|_| {
      panic!(
        "failed to find diagnostics reporter class '{:}'",
        CLS_DIAGNOSTICS_REPORTER
      )
    });
  let ret = env
    .call_static_method(
      jcls,
      "reportNativeDiagnostic",
      METHOD_SIG_REPORT_DIAGNOSTICS,
      &[JValue::Object(&rec)],
    )
    .map_err(|_| {
      env.exception_describe();
      DiagnosticError::Fail
    });
  match ret {
    Ok(_) => Ok(()),
    Err(e) => Err(e),
  }
}
```

#### JNI Function: `createDiagnostic`
```rust
/// JNI: Create a diagnostic record.
///
/// This method round-trips from JVM to create a mutable diagnostic record natively; mostly used for testing.
#[jni("dev.elide.runtime.diag.NativeDiagnostics")]
pub fn createDiagnostic<'a>(mut env: JNIEnv<'a>, _class: JClass<'a>) -> JObject<'a> {
  let mut builder = create_diagnostic();
  builder.with_severity(Severity::Warn);
  builder.with_message("There was an issue");
  let diag = builder
    .build(&mut env)
    .expect("failed to build diagnostic record");
  let _ = report_diagnostic(&mut env, builder);
  diag
}
```

---

## Crate: dns

### Full Source (29 lines)
```rust
/*
 * Copyright (c) 2025 Elide Technologies, Inc. All Rights Reserved.
 *
 * PROPRIETARY AND CONFIDENTIAL. This software may contain trade secrets and
 * confidential information of Elide Technologies, Inc.
 *
 * UNAUTHORIZED USE, COPYING, DISTRIBUTION, OR DISCLOSURE IS STRICTLY PROHIBITED.
 * No part of this software may be shared without prior written consent from
 * Elide Technologies, Inc.
 *
 * Contact: engineering@elide.dev
 */

#![forbid(unsafe_op_in_unsafe_fn)]

capnp::generated_code!(pub mod dns_capnp);

pub mod model;

pub mod resolver;

pub mod capnp_serde;

pub mod service;

pub use model::*;
pub use resolver::DnsResolver;
pub use service::{DNS_SERVICE_ID, DnsService};
```

---

## Crate: http

### Module Documentation
```rust
//! Universal HTTP Server Abstraction
//!
//! This crate provides a minimal, high-performance HTTP server interface
//! designed for build-time backend selection. The primary backend is `faf`
//! (Linux-only), with fallback implementations for other platforms.
//!
//! # Design Principles
//!
//! 1. **Zero-copy where possible** - Request data is borrowed, not owned
//! 2. **Build-time decisions** - Backend selection via cfg/features, no runtime dispatch
//! 3. **Callback-oriented** - Single handler function per server instance
//! 4. **Buffer-based responses** - Direct writes to pre-allocated buffers
```

### Public Modules
```rust
pub mod handler;
pub mod request;
pub mod response;
pub mod server;

pub mod backend_std;
```

### Re-exports
```rust
// Re-exports for convenience
pub use handler::Handler;
pub use request::{Method, Request};
pub use response::{Response, ResponseWriter, StatusCode};
pub use server::{Server, ServerConfig};
```

### Public Items

#### Type Alias: `Result<T>`
```rust
/// HTTP server result type
pub type Result<T> = elidecore::prelude::Result<T, Error>;
```

#### Enum: `Error`
```rust
/// HTTP server errors
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Error {
  /// Failed to bind to the specified port
  BindFailed,
  /// Handler returned an error
  HandlerError,
  /// Response buffer overflow
  BufferOverflow,
  /// Invalid request
  InvalidRequest,
  /// I/O error
  IoError,
  /// Server shutdown
  Shutdown,
}

impl core::fmt::Display for Error {
  fn fmt(&self, f: &mut core::fmt::Formatter<'_>) -> core::fmt::Result {
    match self {
      Error::BindFailed => write!(f, "failed to bind to port"),
      Error::HandlerError => write!(f, "handler returned an error"),
      Error::BufferOverflow => write!(f, "response buffer overflow"),
      Error::InvalidRequest => write!(f, "invalid HTTP request"),
      Error::IoError => write!(f, "I/O error"),
      Error::Shutdown => write!(f, "server shutdown"),
    }
  }
}

impl std::error::Error for Error {}
```

---

## Crate: js

### Imports (verbatim)
```rust
use crate::codegen::{CodegenError, GeneratorOptions};
use elidebase::jni::JNIEnv;
use elidebase::jni::objects::{JClass, JString};
use elidebase::jni::sys::jboolean;
use elidecore::prelude::*;
use elidediag::{DiagnosticBuilder, create_diagnostic, report_diagnostic};
use oxc::span::SourceType;
use std::ffi::{CString, c_char};
```

### Module Documentation
```rust
//! Native JavaScript and TypeScript tooling and API implementations.
//!
//! This crate provides integration with the Oxidation JavaScript toolchain, and implements certain APIs for use in
//! JavaScript environments.
```

### Private Modules
```rust
/// Code generation tools for JavaScript; interoperates with `parser` and other exposed modules.
mod codegen;

/// Pre-compiler implementation.
mod precompiler;

/// WhatWG UUID standard, ULIDs, and other ID generation schemes.
mod idgen;
```

### Public Items

#### Function: `jsapi_generate_uuid_v4_string`
```rust
/// Generate a UUIDv4.
#[bind("dev.elide.lang.javascript.crypto.NativeUuid", "generateUuidV4")]
pub fn jsapi_generate_uuid_v4_string(_call: NativeCall) -> *const c_char {
  idgen::generate_uuid4_cstr()
}
```

#### Function: `jsapi_free_uuid_v4_string`
```rust
/// Free a UUIDv4.
#[bind("dev.elide.lang.javascript.crypto.NativeUuid", "freeUuidV4")]
pub fn jsapi_free_uuid_v4_string(_call: NativeCall, ptr: *mut c_char) {
  if !ptr.is_null() {
    unsafe {
      // Reconstruct the CString and let it drop naturally
      drop(CString::from_raw(ptr));
    }
  };
}
```

#### JNI Function: `precompile`
```rust
/// Precompile JavaScript.
#[jni("dev.elide.lang.javascript.JavaScriptPrecompiler")]
pub fn precompile<'a>(
  mut env: JNIEnv<'a>,
  _class: JClass<'a>,
  name: JString<'a>,
  code: JString<'a>,
  typescript: jboolean,
  jsx: jboolean,
  esm: jboolean,
) -> JString<'a> {
  let str = env.get_string(&code).unwrap();
  let code = str.to_str().to_string();
  let filename = env.get_string(&name).unwrap().to_str().to_string();
  let default_options = GeneratorOptions::default();
  let source_type = if typescript == elidebase::jni::sys::JNI_TRUE {
    if jsx == elidebase::jni::sys::JNI_TRUE {
      Some(SourceType::tsx())
    } else {
      Some(SourceType::ts())
    }
  } else if jsx == elidebase::jni::sys::JNI_TRUE {
    Some(SourceType::jsx())
  } else if esm == elidebase::jni::sys::JNI_TRUE {
    Some(SourceType::mjs())
  } else {
    Some(SourceType::cjs())
  };
  // ... continues with precompilation logic
```

---

## Crate: licensing

### Imports (verbatim)
```rust
use elidebase::cfg::{
  ELIDE_LICENSING_ACCOUNT_ID, ELIDE_LICENSING_ENABLED, ELIDE_LICENSING_ENFORCED,
  ELIDE_LICENSING_PRODUCT_ID, ELIDE_LICENSING_PUBLIC_KEY,
};

use elidecore::prelude::*;
use keygen_rs::{
  config::{self, KeygenConfig},
  license::SchemeCode,
};
use std::sync::atomic::{AtomicBool, Ordering};
```

### Module Documentation
```rust
//! Private licensing structures and routines for Elide's internal use.
//!
//! This crate provides data structures and functions used at runtime to mount the user's license to use Elide, if any,
//! and to manipulate or manage licensing.
```

### Constants
```rust
/// Environment variable where a license key may be set.
pub const ELIDE_LICENSE_ENV_VAR: &str = "ELIDE_LICENSE_KEY";

/// Path to the file where a license key may be stored (default on Linux).
pub const ELIDE_LICENSE_FILE_PATH_LINUX: &str = "/etc/elide/license.key";

/// Path to the file where a license key may be stored (default on Windows).
pub const ELIDE_LICENSE_FILE_PATH_WINDOWS: &str = "C:\\ProgramData\\Elide\\license.key";

/// Path to the file where a license key may be stored (default on macOS).
pub const ELIDE_LICENSE_FILE_PATH_MACOS: &str = "/Library/Application Support/Elide/license.key";
```

### Public Items

#### Enum: `LicensingError`
```rust
/// Enumerates possible licensing system errors that can arise.
#[derive(ErrorType, Debug)]
pub enum LicensingError {
  /// Licensing system has not yet initialized.
  #[error("licensing not initialized")]
  NotInitialized,

  /// An error occurred within the licensing system.
  #[error("licensing system failed: `{0}`")]
  LicensingSystemError(#[from] keygen_rs::errors::Error),
}
```

#### Struct: `LicenseInfo`
```rust
/// Information about the user's Elide license.
pub struct LicenseInfo {
  /// The user's Elide license key, if any.
  license_key: Option<String>,

  /// The user's Elide license token, if any.
  license_token: Option<String>,

  /// Where this license info came from.
  origin: LicenseOrigin,
}
```

#### Function: `pub fn configure_licensing(info: &LicenseInfo) -> Result<bool, LicensingError>`
```rust
/// Configures Elide's premium licensing subsystem early during boot.
pub fn configure_licensing(info: &LicenseInfo) -> Result<bool, LicensingError> {
  if !ELIDE_LICENSING_ENABLED {
    return Ok(false);
  }

  // if licensing already initialized, skip
  if LICENSING_INITIALIZED.is_set() {
    return Ok(LICENSING_CHECKED.load(Ordering::Acquire));
  }
  LICENSING_INITIALIZED.set();

  // if a license key is provided, mount/configure it
  if let Some(license_key) = &info.license_key {
    config::set_config(KeygenConfig {
      account: ELIDE_LICENSING_ACCOUNT_ID.to_string(),
      product: ELIDE_LICENSING_PRODUCT_ID.to_string(),
      license_key: Some(license_key.as_str().to_string()),
      public_key: Some(ELIDE_LICENSING_PUBLIC_KEY.to_string()),
      ..KeygenConfig::default()
    })?;
    Ok(true)
  } else {
    Ok(false)
  }
}
```

#### Function: `pub fn detect_license_from_env() -> Option<String>`
```rust
/// Detect a license key within an environment variable.
pub fn detect_license_from_env() -> Option<String> {
  std::env::var(ELIDE_LICENSE_ENV_VAR).ok()
}
```

#### Function: `pub fn detect_license_from_file(override_file: Option<String>) -> Option<String>`
```rust
/// Detect a license key on-disk at the default path, or the provided `override_path`.
pub fn detect_license_from_file(override_file: Option<String>) -> Option<String> {
  let license_file_path = if let Some(override_path) = override_file {
    override_path
  } else if cfg!(target_os = "linux") {
    ELIDE_LICENSE_FILE_PATH_LINUX.to_string()
  } else if cfg!(target_os = "windows") {
    ELIDE_LICENSE_FILE_PATH_WINDOWS.to_string()
  } else if cfg!(target_os = "macos") {
    ELIDE_LICENSE_FILE_PATH_MACOS.to_string()
  } else {
    return None;
  };

  match std::fs::read_to_string(license_file_path) {
    Ok(contents) => Some(contents.trim().to_string()),
    Err(_) => None,
  }
}
```

---

## Crate: macros

### Imports (verbatim)
```rust
use proc_macro::TokenStream;
use proc_macro2::TokenStream as TokenStream2;
use quote::{format_ident, quote};
use syn::spanned::Spanned;
use syn::{
  FnArg, ItemFn, LitStr, Pat, Token, Type,
  parse::{Parse, ParseStream},
  parse_macro_input,
};
```

### Module Documentation
```rust
//! Procedural macros for Elide native function bindings.
//!
//! This crate provides the `#[bind]` attribute macro for declaring native functions
//! that can be exposed over multiple foreign function interfaces (JNI, Panama, Native Image C API).
```

### Public Items

#### Proc Macro: `#[bind]`
```rust
/// Annotate a function to bind it for native export.
///
/// # Arguments
///
/// The attribute takes two string arguments:
/// 1. JNI class path (e.g., `"com.example.Native"`)
/// 2. Exported function name (used for C ABI, Panama, Native Image)
///
/// # Function Signature
///
/// The function may optionally take a `NativeCall` as its first parameter.
/// This struct provides access to JNI environment and class when called from JNI,
/// or is empty when called from other contexts.
///
/// # Generated Code
///
/// This macro generates:
/// - `{name}_impl`: The inner implementation (renamed from original)
/// - `{export_name}`: C-ABI exported function
/// - `Java_{class}_{method}`: JNI wrapper (feature-gated behind `jni`)
/// - Inventory registration for `NativeBinding`
#[proc_macro_attribute]
pub fn bind(attr: TokenStream, item: TokenStream) -> TokenStream {
  let args = parse_macro_input!(attr as BindArgs);
  let input = parse_macro_input!(item as ItemFn);

  match bind_impl(args, input) {
    Ok(tokens) => tokens.into(),
    Err(err) => err.to_compile_error().into(),
  }
}
```

#### Proc Macro: `#[on_init]`
```rust
/// Annotate a function to be called during initialization (similar to JNI_OnLoad).
///
/// # Function Signature
///
/// The function may optionally take a `&NativeCall` as its first (and only) parameter.
/// It must return `InitResult` (which is `Result<InitStatus, InitError>`).
///
/// # Generated Code
///
/// This macro generates:
/// - `{name}_impl`: The inner implementation (renamed from original)
/// - `{name}_wrapper`: A wrapper that accepts `&NativeCall` (always)
/// - Inventory registration for `OnInitBinding`
#[proc_macro_attribute]
pub fn on_init(_attr: TokenStream, item: TokenStream) -> TokenStream {
  let input = parse_macro_input!(item as ItemFn);

  match on_init_impl(input) {
    Ok(tokens) => tokens.into(),
    Err(err) => err.to_compile_error().into(),
  }
}
```

---

## Crate: o11y

### Imports (verbatim)
```rust
use elidecore::prelude::*;
use env_logger::Env;
```

### Module Documentation
```rust
//! Observability facilities, including logging and tracing.
//!
//! This crate provides common wiring for logging and tracing facilities used throughout Elide, and from guest code.
```

### Constants
```rust
/// Environment variable to control log level.
const ELIDE_LOG_ENV: &str = "ELIDE_LOG";

/// Environment variable to control log styling.
const ELIDE_LOG_STYLE_ENV: &str = "ELIDE_LOG_STYLE";
```

### Public Modules
```rust
/// Provides logging facilities used throughout Elide.
pub mod logging;

/// Provides tracing facilities used throughout Elide.
pub mod tracing;
```

### Public Items

#### Static: `BOOT_TIME`
```rust
/// Timestamp held for program boot.
static BOOT_TIME: once_cell::sync::Lazy<std::time::Instant> =
  once_cell::sync::Lazy::new(std::time::Instant::now);
```

#### Function: `pub fn boot_time() -> std::time::Instant`
```rust
/// Retrieve the program boot time as an `Instant`.
pub fn boot_time() -> std::time::Instant {
  *BOOT_TIME
}
```

#### Function: `pub fn setup_o11y() -> Result<(), Box<dyn ::std::error::Error>>`
```rust
/// Setup observability (O11Y) services, including logging, tracing, and so on.
pub fn setup_o11y() -> Result<(), Box<dyn ::std::error::Error>> {
  // make sure boot time is initialized
  let _ = &*BOOT_TIME;

  // init logger from env, set subscriber
  let env = Env::new()
    .filter(ELIDE_LOG_ENV)
    .write_style(ELIDE_LOG_STYLE_ENV);
  ::env_logger::try_init_from_env(env)?;
  Ok(())
}
```

---

## Crate: rpc

### Full Source (33 lines)
```rust
/*
 * Copyright (c) 2025 Elide Technologies, Inc. All Rights Reserved.
 *
 * PROPRIETARY AND CONFIDENTIAL. This software may contain trade secrets and
 * confidential information of Elide Technologies, Inc.
 *
 * UNAUTHORIZED USE, COPYING, DISTRIBUTION, OR DISCLOSURE IS STRICTLY PROHIBITED.
 * No part of this software may be shared without prior written consent from
 * Elide Technologies, Inc.
 *
 * Contact: engineering@elide.dev
 */

capnp::generated_code!(pub mod base_capnp);
capnp::generated_code!(pub mod cli_capnp);
capnp::generated_code!(pub mod env_capnp);
capnp::generated_code!(pub mod url_capnp);
capnp::generated_code!(pub mod http_capnp);
capnp::generated_code!(pub mod sys_capnp);
capnp::generated_code!(pub mod tools_capnp);
capnp::generated_code!(pub mod engine_capnp);
capnp::generated_code!(pub mod invocation_capnp);
capnp::generated_code!(pub mod envelope_capnp);

pub mod dispatcher;
pub mod error;
pub mod queue;
pub mod runtime;

pub use dispatcher::{RpcDispatcher, RpcFrame, RpcService};
pub use error::{RpcError, RpcErrorCode, RpcResult};
pub use runtime::RpcRuntime;
```

---

## Crate: runtime (sidecar)

### Imports (verbatim)
```rust
use crate as _;
use bindings::invoke_all_init_with;
use bumpalo::{Bump, boxed::Box};
use elidebase as _;
use elidecache as _;
use elidecore as _;
use elidecore::prelude::*;
use elidedb as _;
use elidediag as _;
use elidedns::{self as _, DnsService};
use elidejs as _;
use elidelicensing as _;
use elideo11y as _;
use eliderpc::{self as _, RpcRuntime};
use elideterminal as _;
use elidetransport as _;
use elideweb as _;
use log::{Level, log};
use std::num::NonZero;
use std::sync::Arc;
use std::sync::atomic::{AtomicPtr, Ordering};
use std::thread::available_parallelism;

use tokio::runtime::{Handle, Runtime};
```

### Module Documentation
```rust
//! Top-most crate for Elide's runtime native libraries.
//!
//! This is the ultimate crate linked into the Native Image engine binary; bindings are consumed from here in order to
//! integrate the native side of Elide with the JVM/SVM side.
```

### Public Items

#### Function: `pub fn initialize_async_runtime(tenant_id: &u32, bump: &Bump) -> Handle`
```rust
/// Initialize the async runtime for the given tenant; if the `tenant_id` is `0`, we are running in single-tenant mode.
pub fn initialize_async_runtime(tenant_id: &u32, bump: &Bump) -> Handle {
  let cpu_count = available_parallelism()
    .unwrap_or(NonZero::new(1).unwrap())
    .get();
  log!(Level::Trace, "cpu_count={}", cpu_count);

  let max_blockers = (cpu_count * 2) as usize;
  log!(Level::Trace, "max_blockers={}", max_blockers);

  #[cfg(feature = "multitenant")]
  if tenant_id != 0 {
    return get_or_create_tenant(cpu_count, max_blockers, bump, &tenant_id).to_owned();
  }

  // single tenant runtime from here
  debug_assert!(
    *tenant_id == 0,
    "Only single-tenant runtime initialization is supported here"
  );
  let rt = create_runtime(cpu_count, max_blockers, bump);

  // return handle to the newly created runtime
  std::mem::forget(Runtime::enter(&rt));
  let ptr = Box::into_raw(rt);
  let old = RUNTIME.swap(ptr, Ordering::SeqCst);
  debug_assert!(old.is_null(), "Runtime already initialized");

  // obtain runtime and create fresh handle owned by caller
  unsafe { (&*ptr).handle().clone() }
}
```

#### Function: `initialize_elide_natives`
```rust
#[bind("dev.elide.runtime.substrate.NativeLibs", "initializeNative")]
pub fn initialize_elide_natives(call: NativeCall) -> bool {
  invoke_all_init_with(&call).is_ok()
}
```

#### Module: `telemetry_integration`
```rust
/// Telemetry integration module - provides IPC communication with sidecar for telemetry.
pub mod telemetry_integration {
  // ... contains sidecar socket management and telemetry event forwarding
}
```

#### RPC Runtime FFI Functions
```rust
#[bind("dev.elide.internal.rpc.NativeRpc", "createRpcRuntime")]
pub fn create_rpc_runtime_ffi(capacity: i32) -> i64

#[bind("dev.elide.internal.rpc.NativeRpc", "destroyRpcRuntime")]
pub fn destroy_rpc_runtime_ffi(handle: i64)

#[bind("dev.elide.internal.rpc.NativeRpc", "nextRequestId")]
pub fn next_request_id(handle: i64) -> i64

#[bind("dev.elide.internal.rpc.NativeRpc", "enqueueRequest")]
pub fn enqueue_request(mut call: NativeCall, handle: i64, data: JByteArray) -> bool

#[bind("dev.elide.internal.rpc.NativeRpc", "dequeueRequest")]
pub fn dequeue_request(mut call: NativeCall, handle: i64) -> jbyteArray

#[bind("dev.elide.internal.rpc.NativeRpc", "enqueueResponse")]
pub fn enqueue_response(mut call: NativeCall, handle: i64, data: JByteArray) -> bool

#[bind("dev.elide.internal.rpc.NativeRpc", "dequeueResponse")]
pub fn dequeue_response(mut call: NativeCall, handle: i64) -> jbyteArray

#[bind("dev.elide.internal.rpc.NativeRpc", "pendingRequests")]
pub fn pending_requests(handle: i64) -> i32

#[bind("dev.elide.internal.rpc.NativeRpc", "pendingResponses")]
pub fn pending_responses(handle: i64) -> i32

#[bind("dev.elide.internal.rpc.NativeRpc", "waitForResponses")]
pub fn wait_for_responses(handle: i64, timeout_ms: i64) -> jboolean

#[bind("dev.elide.internal.rpc.NativeRpc", "pollResponse")]
pub fn poll_response(mut call: NativeCall, handle: i64, callback: JObject) -> bool

#[bind("dev.elide.internal.rpc.NativeRpc", "drainResponses")]
pub fn drain_responses(mut call: NativeCall, handle: i64, callback: JObject) -> i32

#[bind("dev.elide.internal.rpc.NativeRpc", "shutdown")]
pub fn shutdown_rpc(handle: i64)
```

---

## Crate: sidecar

### Full Source (35 lines)
```rust
/*
 * Copyright (c) 2025 Elide Technologies, Inc. All Rights Reserved.
 *
 * PROPRIETARY AND CONFIDENTIAL. This software may contain trade secrets and
 * confidential information of Elide Technologies, Inc.
 *
 * UNAUTHORIZED USE, COPYING, DISTRIBUTION, OR DISCLOSURE IS STRICTLY PROHIBITED.
 * No part of this software may be shared without prior written consent from
 * Elide Technologies, Inc.
 *
 * Contact: engineering@elide.dev
 */

//! Sidecar binary management for Elide.
//!
//! This crate implements the sidecar pattern where a background process handles telemetry and other
//! cross-process concerns. Multiple Elide processes of the same version share a single sidecar instance.

mod args;
mod client;
mod logs;
mod options;
mod policy;
mod protocol;
mod server;

pub use args::SidecarArgs;
pub use client::{
  ensure_sidecar_running, show_sidecar_status, shutdown_sidecar, tail_sidecar_logs,
};
pub use elidetransport::ipc::version_hash;
pub use options::SidecarPolicyOptions;
pub use policy::{is_sidecar_supported, should_use_sidecar};
pub use server::run_sidecar_server;
```

---

## Crate: sys

### Full Source (41 lines)
```rust
/*
 * Copyright (c) 2025 Elide Technologies, Inc. All Rights Reserved.
 *
 * PROPRIETARY AND CONFIDENTIAL. This software may contain trade secrets and
 * confidential information of Elide Technologies, Inc.
 *
 * UNAUTHORIZED USE, COPYING, DISTRIBUTION, OR DISCLOSURE IS STRICTLY PROHIBITED.
 * No part of this software may be shared without prior written consent from
 * Elide Technologies, Inc.
 *
 * Contact: engineering@elide.dev
 */

#![feature(random)]

//! System and I/O facilities used by Elide's crates.

/// Export our pre-amble, which is additive on top of `core`.
pub mod prelude;

/// Structures, routines, and utilities for working with file system paths.
pub mod paths;

/// File system utilities and abstractions.
pub mod fs;

/// Supplies utilities for obtaining references to special directories.
pub mod dirs;

/// Input/Output utilities and abstractions.
pub mod io;

/// Process abstractions.
pub mod proc;

/// Supplies utilities for randomness.
pub mod rand;

/// File locking for process synchronization.
pub mod lock;
```

---

## Crate: telemetry

### Imports (verbatim) - First 50 lines
```rust
use elidebase::cfg::{
  ELIDE_DEBUG_MODE, ELIDE_RELEASE_MODE, ELIDE_RELEASE_NUMBER, ELIDE_TARGET_ARCH_FAMILY,
  ELIDE_TARGET_OS, ELIDE_TELEMETRY_API_KEY, ELIDE_TELEMETRY_ENDPOINT, ELIDE_VERSION,
};
use elidecore::prelude::*;
use elideo11y::boot_time;
use elideruntime::obtain_runtime_handle_for_tenant_safe;
use elidetransport::dns::obtain_reqwest_internal_resolver;
use parking_lot::Mutex;
use reqwest::Client;
use reqwest::Version;
use rustls::client::Resumption;
use rustls::crypto::aws_lc_rs::cipher_suite::{
  TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,
  TLS13_AES_128_GCM_SHA256, TLS13_CHACHA20_POLY1305_SHA256,
};
use rustls::{ClientConfig, RootCertStore};
#[cfg(feature = "multitenant")]
use std::collections::HashMap;
use std::net::SocketAddr;
use std::sync::Arc;
use std::sync::atomic::AtomicU32;
use std::time::{Duration, Instant, SystemTime, UNIX_EPOCH};
use tokio::sync::OnceCell;
use tracing::{debug, error, trace};
```

### Module Documentation
```rust
//! Telemetry and flight recorder facilities for Elide.
```

### Constants
```rust
/// Telemetry protocol version.
pub const TELEMETRY_PROTOCOL_VERSION: u8 = 2;

/// Domain pre-loaded for DNS resolution for the UDP receiver.
const ELIDE_RECEIVER_DOMAIN: &str = "receiver.elide.events";

/// First second of 2026 (in milliseconds since UNIX epoch).
/// Used as baseline for relative timestamps to reduce payload size.
pub const GLOBAL_EVENT_OFFSET: u64 = 1767225600000;

/// Elide platform header.
const ELIDE_X_PLATFORM_HEADER: &str = "x-elide-platform";
```

### Public Items

#### Static: `TELEMETRY_METADATA`
```rust
/// Baked-in event metadata.
pub static TELEMETRY_METADATA: EventMetadata = EventMetadata(
  ELIDE_RELEASE_NUMBER,
  match (ELIDE_TARGET_OS, ELIDE_TARGET_ARCH_FAMILY) {
    ("linux", "amd64") => ElidePlatform::LinuxAmd64,
    ("linux", "arm64") => ElidePlatform::LinuxArm64,
    ("macos", "amd64") => ElidePlatform::DarwinAmd64,
    ("macos", "arm64") => ElidePlatform::DarwinArm64,
    ("windows", "amd64") => ElidePlatform::WindowsAmd64,
    _ => ElidePlatform::Unknown,
  },
  ELIDE_RELEASE_MODE,
  ELIDE_DEBUG_MODE,
  0, // Placeholder for feature bitmask
);
```

#### Function: `pub fn reset_telemetry_context(tenant_id: &ElideTenantId)`
```rust
/// Reset telemetry batch context for a tenant.
///
/// Panic-safe: catches all panics to prevent telemetry from crashing the binary.
pub fn reset_telemetry_context(tenant_id: &ElideTenantId) {
  // ... implementation
}
```

#### Function: `pub fn queue_event(tenant_id: &ElideTenantId, run_id: &u32, ev: TelemetryEventData)`
```rust
/// Queue a telemetry event for delivery. Non-blocking.
///
/// Sends via sidecar IPC if available, otherwise falls back to encrypted UDP.
/// Both paths use msgpack serialization for consistency.
/// Panic-safe: catches all panics to prevent telemetry from crashing the binary.
pub fn queue_event(tenant_id: &ElideTenantId, run_id: &u32, ev: TelemetryEventData) {
  // ... implementation
}
```

#### Function: `pub fn create_client(long_running: bool) -> Client`
```rust
#[inline(always)]
pub fn create_client(long_running: bool) -> Client {
  // Creates a reqwest HTTP client with:
  // - TLS 1.2/1.3 support
  // - HTTP/2 and HTTP/3 support
  // - Connection pooling
  // - DNS pre-resolution
  // - Compression (brotli, gzip, zstd)
}
```

#### Function: `pub fn init_telemetry(runtime: &tokio::runtime::Handle, tenant_id: &ElideTenantId, run_id: &EventRunId)`
```rust
/// Initialize the telemetry subsystem.
///
/// Panic-safe: catches all panics to prevent telemetry from crashing the binary.
pub fn init_telemetry(
  runtime: &tokio::runtime::Handle,
  tenant_id: &ElideTenantId,
  run_id: &EventRunId,
) {
  // ... implementation
}
```

#### Function: `pub fn telemetry_event(tenant: &u32, run: &u32, event: Event)`
```rust
/// Record a telemetry event.
///
/// **Panic Safety**: This function catches all panics to prevent telemetry from crashing the binary.
pub fn telemetry_event(tenant: &u32, run: &u32, event: Event) {
  // ... implementation
}
```

#### Function: `pub fn flush_telemetry(rt: &tokio::runtime::Handle)`
```rust
/// Flush telemetry (for backward compatibility - uses tenant 0).
pub fn flush_telemetry(rt: &tokio::runtime::Handle) {
  flush_telemetry_for_tenant(rt, &0);
}
```

---

## Crate: terminal

### Full Source (19 lines - stub crate)
```rust
/*
 * Copyright (c) 2025 Elide Technologies, Inc. All Rights Reserved.
 *
 * PROPRIETARY AND CONFIDENTIAL. This software may contain trade secrets and
 * confidential information of Elide Technologies, Inc.
 *
 * UNAUTHORIZED USE, COPYING, DISTRIBUTION, OR DISCLOSURE IS STRICTLY PROHIBITED.
 * No part of this software may be shared without prior written consent from
 * Elide Technologies, Inc.
 *
 * Contact: engineering@elide.dev
 */

//! Native terminal rendering and manipulation.
//!
//! This crate provides access to native terminal facilites on the host operating system.

// Nothing yet.
```

---

## Crate: transport

### Full Source (27 lines)
```rust
/*
 * Copyright (c) 2025 Elide Technologies, Inc. All Rights Reserved.
 *
 * PROPRIETARY AND CONFIDENTIAL. This software may contain trade secrets and
 * confidential information of Elide Technologies, Inc.
 *
 * UNAUTHORIZED USE, COPYING, DISTRIBUTION, OR DISCLOSURE IS STRICTLY PROHIBITED.
 * No part of this software may be shared without prior written consent from
 * Elide Technologies, Inc.
 *
 * Contact: engineering@elide.dev
 */

//! Native transport and socket facilities.
//!
//! This crate provides native networking and transport capabilities for Elide, through OS-specific implementations
//! which are bound to higher-level abstractions for Netty.

/// Inter-process communication via platform-specific sockets.
pub mod ipc;

/// Native URL parsing and pattern matching.
pub mod url;

/// DNS client, caching configurations, and so on.
pub mod dns;
```

---

## Crate: web

### Full Source (20 lines - stub crate)
```rust
/*
 * Copyright (c) 2025 Elide Technologies, Inc. All Rights Reserved.
 *
 * PROPRIETARY AND CONFIDENTIAL. This software may contain trade secrets and
 * confidential information of Elide Technologies, Inc.
 *
 * UNAUTHORIZED USE, COPYING, DISTRIBUTION, OR DISCLOSURE IS STRICTLY PROHIBITED.
 * No part of this software may be shared without prior written consent from
 * Elide Technologies, Inc.
 *
 * Contact: engineering@elide.dev
 */

//! Web APIs and capabilities.
//!
//! This crate provides certain implementations for APIs which relate to web applications, and also tooling utilities
//! and routines which implement web builder capabilities.

// Nothing yet.
```

---

## Summary Statistics

| Crate | LOC | Public Items | Dependencies |
|-------|-----|--------------|--------------|
| base | 39 | 8 | bindings |
| bindings | 475 | 25+ | anyhow, inventory, jni |
| builder | 1298 | 40+ | bindgen, cc, serde |
| cache | 15 | 0 | - |
| cli | 376 | 30+ | clap, elidesys |
| core | 50 | 5 | elidebase |
| db | 942 | 70+ | java_native, sqlite3 |
| diag | 217 | 10 | jni |
| dns | 29 | 5 | capnp |
| http | 61 | 10 | elidecore |
| js | 121 | 5 | oxc, jni |
| licensing | 226 | 10 | keygen_rs |
| macros | 577 | 2 | proc_macro, syn, quote |
| o11y | 54 | 5 | env_logger |
| rpc | 33 | 5 | capnp |
| runtime | 577 | 20+ | tokio, bumpalo |
| sidecar | 35 | 8 | - |
| sys | 41 | 8 | - |
| telemetry | 933 | 15+ | reqwest, rustls, rmp_serde |
| terminal | 19 | 0 | - |
| transport | 27 | 3 | - |
| web | 20 | 0 | - |

**Total: 22 crates, ~6,164 lines of lib.rs code**

---

End of Phase 1 Catalog.
