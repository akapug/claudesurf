# Phase 1: Whiplash Complete Crate Analysis

Generated: 2026-01-11
Total Crates: 22

---

## Crate: base

### Imports (verbatim)
```rust
/* None at lib.rs level - module declarations only */
```

### Module Structure
- `cfg` - Exports public constants known at build-time
- `prelude` - Prepares common imports and exports
- `init` - Initialization tools and helpers

### Public Items

#### Re-exports
```rust
pub use bindings::inventory;
pub use bindings::{InitError, InitResult, InitStatus, NativeBinding, NativeCall, OnInitBinding};
#[cfg(feature = "jni")]
pub use jni;
```

### Full lib.rs Content (39 lines)
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
use anyhow::Result;
pub use macros::{bind, on_init};
#[doc(hidden)]
pub use inventory;
use crate::prelude::*;
```

### Module Structure
- `prelude` - Exports own prelude

### Public Items

#### Struct: `NativeCall<'a>`
```rust
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

#### Function: `pub fn empty() -> Self`
First 20 lines:
```rust
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
```

#### Function: `pub fn from_jni(env: JNIEnv<'a>, class: JClass<'a>) -> Self`
```rust
  #[cfg(feature = "jni")]
  #[inline]
  #[must_use]
  pub fn from_jni(env: JNIEnv<'a>, class: JClass<'a>) -> Self {
    Self {
      env: Some(env),
      class: Some(class),
    }
  }
```

#### Function: `pub fn is_jni(&self) -> bool`
```rust
  #[inline]
  #[must_use]
  pub fn is_jni(&self) -> bool {
    #[cfg(feature = "jni")]
    {
      self.env.is_some()
    }
    #[cfg(not(feature = "jni"))]
    {
      false
    }
  }
```

#### Struct: `NativeBinding`
```rust
#[derive(Debug, Clone)]
pub struct NativeBinding {
  pub name: &'static str,
  pub export_name: &'static str,
  pub jni_class: &'static str,
  pub jni_path: &'static str,
  pub jni_name: &'static str,
  pub signature: &'static str,
  pub source_file: &'static str,
  pub source_line: u32,
}
```

#### Function: `pub fn bindings() -> impl Iterator<Item = &'static NativeBinding>`
```rust
#[inline]
pub fn bindings() -> impl Iterator<Item = &'static NativeBinding> {
  inventory::iter::<NativeBinding>.into_iter()
}
```

#### Function: `pub fn binding_count() -> usize`
```rust
#[inline]
#[must_use]
pub fn binding_count() -> usize {
  inventory::iter::<NativeBinding>.into_iter().count()
}
```

#### Struct: `InitStatus`
```rust
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct InitStatus {
  pub code: i32,
}
```

#### Struct: `InitError`
```rust
#[derive(Debug, Clone)]
pub struct InitError {
  pub message: &'static str,
  pub code: Option<i32>,
}
```

#### Struct: `OnInitBinding`
```rust
#[derive(Debug, Clone)]
pub struct OnInitBinding {
  pub name: &'static str,
  pub source_file: &'static str,
  pub source_line: u32,
  pub init_fn: fn(&NativeCall) -> InitResult,
}
```

#### Function: `pub fn invoke_all_init() -> InitResult`
```rust
pub fn invoke_all_init() -> InitResult {
  for binding in init_bindings() {
    binding.invoke()?;
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

### Constants (verbatim)
```rust
const DEBUG: &str = "debug";
const RELEASE: &str = "release";
const DARWIN: &str = "darwin";
const LINUX: &str = "linux";
const WINDOWS: &str = "windows";
const AMD64: &str = "amd64";
const ARM64: &str = "aarch64";
const MIMALLOC_PATH: &str = "mimalloc-2.2";
pub const MACOS_MIN: &str = "11.0";
const ARCH_TARGET_X86_64: &str = "x86-64-v3";
const ARCH_TARGET_ARM64: &str = "armv8-a+crypto+crc+simd";
const MACOS_DEPLOYMENT_TARGET: &str = "11.0";
```

### Public Items

#### Enum: `BuildMode`
```rust
#[derive(Debug, Serialize, Deserialize, PartialEq, Eq)]
pub enum BuildMode {
  Debug,
  Release,
}
```

#### Enum: `OperatingSystem`
```rust
#[derive(Debug, Serialize, Deserialize, PartialEq, Eq)]
pub enum OperatingSystem {
  Darwin,
  Linux,
  Windows,
}
```

#### Enum: `Architecture`
```rust
#[derive(Debug, Serialize, Deserialize, PartialEq, Eq)]
pub enum Architecture {
  Amd64,
  Arm64,
}
```

#### Struct: `HostInfo`
```rust
#[derive(Debug, Serialize, Deserialize, PartialEq, Eq)]
pub struct HostInfo {
  pub os: OperatingSystem,
  pub arch: Architecture,
}
```

#### Struct: `ElideInfo`
```rust
#[derive(Debug, Serialize, Deserialize, PartialEq, Eq)]
pub struct ElideInfo {
  pub host: HostInfo,
}
```

#### Function: `pub fn project_root() -> PathBuf`
```rust
pub fn project_root() -> PathBuf {
  let basecrate = env::current_dir().unwrap();
  basecrate.parent().unwrap().parent().unwrap().to_path_buf()
}
```

#### Function: `pub fn java_home() -> PathBuf`
```rust
pub fn java_home() -> PathBuf {
  if let Some(managed) = managed_toolchain_home("gvm") {
    return managed;
  }
  let java_home = std::env::var("JAVA_HOME").expect(
    "JAVA_HOME environment variable is not set and no managed GraalVM toolchain found.\n\
     Run: builder toolchains install gvm",
  );
  Path::new(&java_home).to_path_buf()
}
```

#### Function: `pub fn prepare_builder_environment() -> BuilderConfig`
```rust
pub fn prepare_builder_environment() -> BuilderConfig {
  check_no_rustflags();
  let root = project_root();
  println!("cargo:rustc-env=PROJECT_ROOT={}", root.display());
  let graalvm_home = graalvm_home();
  println!("cargo:rustc-env=GRAALVM_HOME={}", graalvm_home.display());
  println!("cargo:rustc-env=JAVA_HOME={}", graalvm_home.display());
  let artifacts_dir = artifacts_path();
  println!("cargo:rustc-env=ARTIFACTS_DIR={}", artifacts_dir.display());
  inject_env();
  BuilderConfig { root, graalvm_home }
}
```

---

## Crate: cache

### Imports (verbatim)
```rust
/* Empty - file contains only copyright notice and comment */
```

### Public Items
```rust
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

### Module Structure (internal)
- `commons` - Shared structures
- `init`, `info`, `run`, `serve`, `build`, `test`, `dev`, `format` - Top-level commands
- `lsp`, `mcp`, `project`, `install`, `classpath`, `pro` - Additional commands
- `java`, `javac`, `javap`, `javadoc`, `kotlinc`, `javaformat`, `ktfmt`, `native_image`, `jar`, `jib` - Embedded tools
- `sidecar` - Sidecar management

### Public Items

#### Struct: `ElideCli`
```rust
#[derive(Parser, Debug)]
#[command(version, about, author, long_about = None, propagate_version = true, args_conflicts_with_subcommands = false)]
pub struct ElideCli {
  #[arg(short, long, global = true, value_name = "FILE")]
  pub config: Option<PathBuf>,
  #[arg(short, long, global = true, action = clap::ArgAction::Count)]
  pub debug: u8,
  #[arg(short, long, global = true)]
  pub quiet: bool,
  #[arg(long, global = true)]
  pub color: bool,
  #[arg(long, global = true)]
  pub no_color: bool,
  #[arg(long, global = true)]
  pub crash: bool,
  #[arg(long, global = true)]
  pub no_native: bool,
  #[arg(long, global = true)]
  pub no_telemetry: bool,
  #[arg(short = 'p', long = "project", global = true, value_name = "path")]
  pub project: Option<String>,
  #[arg(value_name = "FILE")]
  pub file: Option<PathBuf>,
  #[arg(short = 's', long = "snippet", value_name = "CODE")]
  pub code: Option<String>,
  #[arg(last = true)]
  pub script_args: Vec<String>,
  #[command(subcommand)]
  pub command: Option<ElideCommands>,
}
```

#### Enum: `ElideCommands`
```rust
#[derive(Subcommand, Debug)]
pub enum ElideCommands {
  Init(InitArgs),
  Info(InfoArgs),
  Run(RunArgs),
  Serve(ServeArgs),
  Build(BuildArgs),
  Test(TestArgs),
  Dev(DevArgs),
  Format(FormatArgs),
  Project(ProjectArgs),
  Classpath(ClasspathArgs),
  Install(InstallArgs),
  Lsp(LspArgs),
  Mcp(McpArgs),
  Java(JavaArgs),
  Javac(JavacArgs),
  Javap(JavapArgs),
  Javadoc(JavadocArgs),
  Kotlinc(KotlincArgs),
  NativeImage(NativeImageArgs),
  Jar(JarArgs),
  Jib(JibArgs),
  Javaformat(JavaFormatArgs),
  Ktfmt(KtfmtArgs),
  Pro(ProArgs),
  Sidecar(SidecarArgs),
}
```

#### Function: `pub fn try_parse_cli() -> Result<ElideCli, clap::Error>`
```rust
#[inline]
pub fn try_parse_cli() -> Result<ElideCli, clap::Error> {
  ElideCli::try_parse()
}
```

---

## Crate: core

### Imports (verbatim)
```rust
use elidebase::prelude::*;
```

### Module Structure
- `allocator` (conditional: `feature = "mimalloc"`)
- `prelude` - Extended prelude

### Public Items

#### Function: `pub fn initialize_runtime_with_call(call: &NativeCall) -> InitResult`
```rust
#[on_init]
pub fn initialize_runtime_with_call(call: &NativeCall) -> InitResult {
  if call.is_jni() {
    // Perform JNI-specific initialization
  }
  Ok(InitStatus::SUCCESS)
}
```

#### Function: `pub fn initialize_runtime_simple() -> InitResult`
```rust
#[on_init]
pub fn initialize_runtime_simple() -> InitResult {
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

### Module Structure
- `sqlite3` - Generated SQLite3 bindings

### Public Items (JNI Functions for SQLite)

All functions are JNI bindings for `org.sqlite.core.NativeDB`:

```rust
pub unsafe fn isStatic(env: *mut JNIEnv, this: *mut c_void) -> jint
pub unsafe fn initializeStatic(env: *mut JNIEnv, this: *mut c_void) -> jint
pub unsafe fn openUtf8(env: *mut JNIEnv, this: jobject, jfilename: jbyteArray, flags: jint)
pub unsafe fn _close(env: *mut JNIEnv, this: jobject)
pub unsafe fn _exec_utf8(env: *mut JNIEnv, this: jobject, jsql: jbyteArray) -> jint
pub unsafe fn shared_cache(env: *mut JNIEnv, this: jobject, enable: jboolean) -> jint
pub unsafe fn prepare_utf8(env: *mut JNIEnv, this: jobject, jsql: jbyteArray) -> jlong
pub unsafe fn step(env: *mut JNIEnv, this: jobject, stmt: jlong) -> jint
pub unsafe fn reset(env: *mut JNIEnv, this: jobject, stmt: jlong) -> jint
pub unsafe fn finalize(env: *mut JNIEnv, this: jobject, stmt: jlong) -> jint
pub unsafe fn bind_int(env: *mut JNIEnv, this: jobject, stmt: jlong, pos: jint, val: jint) -> jint
pub unsafe fn bind_long(env: *mut JNIEnv, this: jobject, stmt: jlong, pos: jint, val: jlong) -> jint
pub unsafe fn bind_double(env: *mut JNIEnv, this: jobject, stmt: jlong, pos: jint, val: jdouble) -> jint
pub unsafe fn bind_text_utf8(env: *mut JNIEnv, this: jobject, stmt: jlong, pos: jint, val: jbyteArray) -> jint
pub unsafe fn bind_blob(env: *mut JNIEnv, this: jobject, stmt: jlong, pos: jint, val: jbyteArray) -> jint
pub unsafe fn column_count(env: *mut JNIEnv, this: jobject, stmt: jlong) -> jint
pub unsafe fn column_type(env: *mut JNIEnv, this: jobject, stmt: jlong, col: jint) -> jint
pub unsafe fn column_int(env: *mut JNIEnv, this: jobject, stmt: jlong, col: jint) -> jint
pub unsafe fn column_long(env: *mut JNIEnv, this: jobject, stmt: jlong, col: jint) -> jlong
pub unsafe fn column_double(env: *mut JNIEnv, this: jobject, stmt: jlong, col: jint) -> jdouble
pub unsafe fn column_text_utf8(env: *mut JNIEnv, this: jobject, stmt: jlong, col: jint) -> jobject
pub unsafe fn column_blob(env: *mut JNIEnv, this: jobject, stmt: jlong, col: jint) -> jbyteArray
pub unsafe fn backup(...) -> jint
pub unsafe fn restore(...) -> jint
pub unsafe fn serialize(env: *mut JNIEnv, this: jobject, db: jstring) -> jbyteArray
pub unsafe fn deserialize(env: *mut JNIEnv, this: jobject, jschema: jstring, jbuff: jbyteArray)
```

---

## Crate: diag

### Imports (verbatim)
```rust
use java_native::jni;
use jni::JNIEnv;
use jni::objects::{JClass, JObject, JValue};
```

### Public Items

#### Enum: `Severity`
```rust
#[derive(Copy, Debug, Clone, Default)]
pub enum Severity {
  #[default]
  Info = 0,
  Warn = 1,
  Error = 2,
}
```

#### Struct: `MutableDiagnostic`
```rust
#[derive(Debug, Default)]
pub struct MutableDiagnostic {
  severity: Severity,
  lang: Option<String>,
  tool: Option<String>,
  message: Option<String>,
  advice: Option<String>,
}
```

#### Trait: `DiagnosticBuilder`
```rust
pub trait DiagnosticBuilder {
  fn with_lang(&mut self, advice: &str) -> &mut Self;
  fn with_tool(&mut self, advice: &str) -> &mut Self;
  fn with_message(&mut self, message: &str) -> &mut Self;
  fn with_advice(&mut self, advice: &str) -> &mut Self;
  fn with_severity(&mut self, severity: Severity) -> &mut Self;
  fn build<'a>(&self, env: &mut JNIEnv<'a>) -> Result<JObject<'a>, DiagnosticError>;
}
```

#### Function: `pub fn create_diagnostic() -> MutableDiagnostic`
```rust
pub fn create_diagnostic() -> MutableDiagnostic {
  MutableDiagnostic::default()
}
```

#### Function: `pub fn report_diagnostic(...) -> Result<(), DiagnosticError>`
```rust
pub fn report_diagnostic(
  env: &mut JNIEnv,
  builder: MutableDiagnostic,
) -> Result<(), DiagnosticError> {
  let rec = builder.build(env).expect("failed to build diagnostic record");
  // ... JNI call to static method
}
```

---

## Crate: dns

### Imports (verbatim)
```rust
capnp::generated_code!(pub mod dns_capnp);
```

### Module Structure
- `model` - DNS data models
- `resolver` - DNS resolver implementation
- `capnp_serde` - Cap'n Proto serialization
- `service` - DNS service

### Public Items
```rust
pub use model::*;
pub use resolver::DnsResolver;
pub use service::{DNS_SERVICE_ID, DnsService};
```

---

## Crate: http

### Imports (verbatim)
```rust
/* No explicit imports at lib.rs level */
```

### Module Structure
- `handler` - Request handlers
- `request` - HTTP request types
- `response` - HTTP response types
- `server` - Server implementation
- `backend_std` - Standard backend

### Public Items

#### Re-exports
```rust
pub use handler::Handler;
pub use request::{Method, Request};
pub use response::{Response, ResponseWriter, StatusCode};
pub use server::{Server, ServerConfig};
```

#### Type Alias
```rust
pub type Result<T> = elidecore::prelude::Result<T, Error>;
```

#### Enum: `Error`
```rust
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Error {
  BindFailed,
  HandlerError,
  BufferOverflow,
  InvalidRequest,
  IoError,
  Shutdown,
}
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

### Module Structure
- `codegen` - Code generation tools
- `precompiler` - Pre-compiler implementation
- `idgen` - UUID/ULID generation

### Public Items

#### Function: `pub fn jsapi_generate_uuid_v4_string(_call: NativeCall) -> *const c_char`
```rust
#[bind("dev.elide.lang.javascript.crypto.NativeUuid", "generateUuidV4")]
pub fn jsapi_generate_uuid_v4_string(_call: NativeCall) -> *const c_char {
  idgen::generate_uuid4_cstr()
}
```

#### Function: `pub fn jsapi_free_uuid_v4_string(_call: NativeCall, ptr: *mut c_char)`
```rust
#[bind("dev.elide.lang.javascript.crypto.NativeUuid", "freeUuidV4")]
pub fn jsapi_free_uuid_v4_string(_call: NativeCall, ptr: *mut c_char) {
  if !ptr.is_null() {
    unsafe {
      drop(CString::from_raw(ptr));
    }
  };
}
```

#### Function: `pub fn precompile(...) -> JString<'a>` (JNI)
```rust
#[jni("dev.elide.lang.javascript.JavaScriptPrecompiler")]
pub fn precompile<'a>(
  mut env: JNIEnv<'a>,
  _class: JClass<'a>,
  name: JString<'a>,
  code: JString<'a>,
  typescript: jboolean,
  jsx: jboolean,
  esm: jboolean,
) -> JString<'a>
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

### Constants
```rust
pub const ELIDE_LICENSE_ENV_VAR: &str = "ELIDE_LICENSE_KEY";
pub const ELIDE_LICENSE_FILE_PATH_LINUX: &str = "/etc/elide/license.key";
pub const ELIDE_LICENSE_FILE_PATH_WINDOWS: &str = "C:\\ProgramData\\Elide\\license.key";
pub const ELIDE_LICENSE_FILE_PATH_MACOS: &str = "/Library/Application Support/Elide/license.key";
```

### Public Items

#### Enum: `LicensingError`
```rust
#[derive(ErrorType, Debug)]
pub enum LicensingError {
  #[error("licensing not initialized")]
  NotInitialized,
  #[error("licensing system failed: `{0}`")]
  LicensingSystemError(#[from] keygen_rs::errors::Error),
}
```

#### Struct: `LicenseInfo`
```rust
pub struct LicenseInfo {
  license_key: Option<String>,
  license_token: Option<String>,
  origin: LicenseOrigin,
}
```

#### Function: `pub fn configure_licensing(info: &LicenseInfo) -> Result<bool, LicensingError>`
```rust
pub fn configure_licensing(info: &LicenseInfo) -> Result<bool, LicensingError> {
  if !ELIDE_LICENSING_ENABLED {
    return Ok(false);
  }
  if LICENSING_INITIALIZED.is_set() {
    return Ok(LICENSING_CHECKED.load(Ordering::Acquire));
  }
  LICENSING_INITIALIZED.set();
  // ... configure keygen
}
```

#### Function: `pub fn detect_license_from_env() -> Option<String>`
```rust
pub fn detect_license_from_env() -> Option<String> {
  std::env::var(ELIDE_LICENSE_ENV_VAR).ok()
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

### Public Items

#### Procedural Macro: `#[bind(...)]`
```rust
#[proc_macro_attribute]
pub fn bind(attr: TokenStream, item: TokenStream) -> TokenStream
```
Generates:
- Inner implementation function
- C-ABI exported function
- JNI wrapper function (feature-gated)
- Inventory registration for `NativeBinding`

#### Procedural Macro: `#[on_init]`
```rust
#[proc_macro_attribute]
pub fn on_init(_attr: TokenStream, item: TokenStream) -> TokenStream
```
Generates:
- Inner implementation function
- Wrapper accepting `&NativeCall`
- Inventory registration for `OnInitBinding`

---

## Crate: o11y (Observability)

### Imports (verbatim)
```rust
use elidecore::prelude::*;
use env_logger::Env;
```

### Constants
```rust
const ELIDE_LOG_ENV: &str = "ELIDE_LOG";
const ELIDE_LOG_STYLE_ENV: &str = "ELIDE_LOG_STYLE";
```

### Module Structure
- `logging` - Logging facilities
- `tracing` - Tracing facilities

### Public Items

#### Function: `pub fn boot_time() -> std::time::Instant`
```rust
pub fn boot_time() -> std::time::Instant {
  *BOOT_TIME
}
```

#### Function: `pub fn setup_o11y() -> Result<(), Box<dyn ::std::error::Error>>`
```rust
pub fn setup_o11y() -> Result<(), Box<dyn ::std::error::Error>> {
  let _ = &*BOOT_TIME;
  let env = Env::new()
    .filter(ELIDE_LOG_ENV)
    .write_style(ELIDE_LOG_STYLE_ENV);
  ::env_logger::try_init_from_env(env)?;
  Ok(())
}
```

---

## Crate: rpc

### Imports (verbatim)
```rust
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
```

### Module Structure
- `dispatcher` - RPC dispatching
- `error` - Error types
- `queue` - Message queues
- `runtime` - RPC runtime

### Public Items
```rust
pub use dispatcher::{RpcDispatcher, RpcFrame, RpcService};
pub use error::{RpcError, RpcErrorCode, RpcResult};
pub use runtime::RpcRuntime;
```

---

## Crate: runtime

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

### Public Items

#### Function: `pub fn initialize_async_runtime(tenant_id: &u32, bump: &Bump) -> Handle`
```rust
pub fn initialize_async_runtime(tenant_id: &u32, bump: &Bump) -> Handle {
  let cpu_count = available_parallelism()
    .unwrap_or(NonZero::new(1).unwrap())
    .get();
  log!(Level::Trace, "cpu_count={}", cpu_count);
  let max_blockers = (cpu_count * 2) as usize;
  // ... create runtime
}
```

#### Function: `pub fn initialize_elide_natives(call: NativeCall) -> bool` (JNI-bound)
```rust
#[bind("dev.elide.runtime.substrate.NativeLibs", "initializeNative")]
pub fn initialize_elide_natives(call: NativeCall) -> bool {
  invoke_all_init_with(&call).is_ok()
}
```

#### RPC Functions (all JNI-bound to `dev.elide.internal.rpc.NativeRpc`):
```rust
pub fn create_rpc_runtime_ffi(capacity: i32) -> i64
pub fn destroy_rpc_runtime_ffi(handle: i64)
pub fn next_request_id(handle: i64) -> i64
pub fn enqueue_request(call: NativeCall, handle: i64, data: JByteArray) -> bool
pub fn dequeue_request(call: NativeCall, handle: i64) -> jbyteArray
pub fn enqueue_response(call: NativeCall, handle: i64, data: JByteArray) -> bool
pub fn dequeue_response(call: NativeCall, handle: i64) -> jbyteArray
pub fn pending_requests(handle: i64) -> i32
pub fn pending_responses(handle: i64) -> i32
pub fn wait_for_responses(handle: i64, timeout_ms: i64) -> jboolean
pub fn poll_response(call: NativeCall, handle: i64, callback: JObject) -> bool
pub fn drain_responses(call: NativeCall, handle: i64, callback: JObject) -> i32
pub fn shutdown_rpc(handle: i64)
```

---

## Crate: sidecar

### Imports (verbatim)
```rust
/* Module-level only */
```

### Module Structure
- `args` - Sidecar arguments
- `client` - Client functions
- `logs` - Logging
- `options` - Configuration options
- `policy` - Sidecar policy
- `protocol` - Communication protocol
- `server` - Server implementation

### Public Items
```rust
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

### Module Structure
- `prelude` - Extended prelude
- `paths` - Path utilities
- `fs` - Filesystem utilities
- `dirs` - Special directories
- `io` - I/O utilities
- `proc` - Process abstractions
- `rand` - Randomness utilities
- `lock` - File locking

---

## Crate: telemetry

### Imports (verbatim)
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
use rustls::crypto::aws_lc_rs::cipher_suite::{...};
use rustls::{ClientConfig, RootCertStore};
use std::net::SocketAddr;
use std::sync::Arc;
use std::sync::atomic::AtomicU32;
use std::time::{Duration, Instant, SystemTime, UNIX_EPOCH};
use tokio::sync::OnceCell;
use tracing::{debug, error, trace};
```

### Constants
```rust
pub const TELEMETRY_PROTOCOL_VERSION: u8 = 2;
pub const GLOBAL_EVENT_OFFSET: u64 = 1767225600000;
```

### Module Structure
- `emit` - Event emission
- `model` - Telemetry models
- `udp` - UDP transport

### Public Items

#### Function: `pub fn init_telemetry(runtime: &tokio::runtime::Handle, tenant_id: &ElideTenantId, run_id: &EventRunId)`
#### Function: `pub fn telemetry_event(tenant: &u32, run: &u32, event: Event)`
#### Function: `pub fn queue_event(tenant_id: &ElideTenantId, run_id: &u32, ev: TelemetryEventData)`
#### Function: `pub fn flush_telemetry(rt: &tokio::runtime::Handle)`
#### Function: `pub fn create_client(long_running: bool) -> Client`

---

## Crate: terminal

### Content
```rust
//! Native terminal rendering and manipulation.
//!
//! This crate provides access to native terminal facilites on the host operating system.

// Nothing yet.
```

---

## Crate: transport

### Module Structure
- `ipc` - Inter-process communication
- `url` - URL parsing
- `dns` - DNS client

---

## Crate: web

### Content
```rust
//! Web APIs and capabilities.
//!
//! This crate provides certain implementations for APIs which relate to web applications, and also tooling utilities
//! and routines which implement web builder capabilities.

// Nothing yet.
```

---

# Summary

| Crate | Lines | Primary Purpose |
|-------|-------|-----------------|
| base | 39 | Primitive types, prelude, re-exports |
| bindings | 475 | JNI/Native bindings, NativeCall, NativeBinding |
| builder | 1298 | Build system utilities, CC/bindgen integration |
| cache | 15 | (Empty placeholder) |
| cli | 376 | Command-line interface, argument parsing |
| core | 50 | Runtime initialization, allocator |
| db | 942 | SQLite JNI bindings |
| diag | 217 | Diagnostics, error reporting |
| dns | 29 | DNS resolution service |
| http | 61 | HTTP server abstraction |
| js | 121 | JavaScript/TypeScript tooling, UUID generation |
| licensing | 226 | License management, Keygen integration |
| macros | 577 | Procedural macros (#[bind], #[on_init]) |
| o11y | 54 | Observability, logging, tracing |
| rpc | 33 | RPC runtime, Cap'n Proto codegen |
| runtime | 577 | Tokio runtime, RPC FFI, telemetry integration |
| sidecar | 35 | Sidecar process management |
| sys | 41 | System utilities, paths, I/O |
| telemetry | 933 | Telemetry collection and emission |
| terminal | 19 | (Empty placeholder) |
| transport | 27 | IPC, URL, DNS transport |
| web | 20 | (Empty placeholder) |

**Total Crates Analyzed: 22**
