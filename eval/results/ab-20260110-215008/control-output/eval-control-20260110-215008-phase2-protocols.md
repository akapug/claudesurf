# WHIPLASH Protocol Definitions - PHASE 2
## Complete Extraction of All Cap'n Proto and Protocol Buffers Files

Generated: 2026-01-11
Agent: eval-control-20260110-215008

---

## Table of Contents

1. [base.capnp](#basecapnp)
2. [base.proto](#baseproto)
3. [cli.capnp](#clicapnp)
4. [cli.proto](#cliproto)
5. [env.capnp](#envcapnp)
6. [env.proto](#envproto)
7. [url.capnp](#urlcapnp)
8. [url.proto](#urlproto)
9. [http.capnp](#httpcapnp)
10. [http.proto](#httpproto)
11. [sys.capnp](#syscapnp)
12. [sys.proto](#sysproto)
13. [tools.capnp](#toolscapnp)
14. [tools.proto](#toolsproto)
15. [engine.capnp](#enginecapnp)
16. [engine.proto](#engineproto)
17. [invocation.capnp](#invocationcapnp)
18. [invocation.proto](#invocationproto)

---

## base.capnp

**File ID:** `@0x969fea1076ac5a7f`
**Java Package:** `dev.elide.proto.v1`
**Outer Class:** `BaseProtocol`

### Full Content (verbatim)
```capnp
@0x969fea1076ac5a7f;

# Copyright (c) 2024-2025 Elide Technologies, Inc. All Rights Reserved.
# PROPRIETARY AND CONFIDENTIAL. This software may contain trade secrets and
# confidential information of Elide Technologies, Inc.
#
# UNAUTHORIZED USE, COPYING, DISTRIBUTION, OR DISCLOSURE IS STRICTLY PROHIBITED.
#
# No part of this software may be shared without prior written consent from
# Elide Technologies, Inc.
#
# Contact: engineering@elide.dev

using Java = import "/capnp/java.capnp";

$Java.package("dev.elide.proto.v1");
$Java.outerClassname("BaseProtocol");

enum ProtocolVersion {
  # Enumeration of supported protocol versions.

  unspecified @0;
  # Unspecified version.

  v1 @1;
  # Version 1 of the protocol.
}

enum ProtocolFormat {
  # Enumeration of supported protocol formats.

  unspecified @0;
  # Unspecified format.

  capnp @1;
  # Cap'n Proto format, unpacked.

  capnpPacked @2;
  # Cap'n Proto format, packed.

  protobufBinary @3;
  # Protocol Buffers binary format.
}

enum AppEnvironment {
  # Application environments.

  unspecified @0;
  # Unspecified source.

  development @1;
  # Development environment.

  sandbox @2;
  # Sandbox environment.

  staging @3;
  # Staging environment.

  production @4;
  # Production environment.
}
```

### Defined Types
| Type | Kind | Values/Fields |
|------|------|---------------|
| `ProtocolVersion` | enum | unspecified(0), v1(1) |
| `ProtocolFormat` | enum | unspecified(0), capnp(1), capnpPacked(2), protobufBinary(3) |
| `AppEnvironment` | enum | unspecified(0), development(1), sandbox(2), staging(3), production(4) |

---

## base.proto

**Package:** `elide.v1`
**Java Package:** `dev.elide.proto.v1`

### Full Content (verbatim)
```protobuf
/*
 * Copyright (c) 2024-2025 Elide Technologies, Inc. All Rights Reserved.
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

syntax = "proto3";

package elide.v1;

option cc_enable_arenas = true;
option csharp_namespace = "Elide.Protocol.v1";
option go_package = "github.com/elide-dev/elide/protocol/v1;elide_v1";
option java_multiple_files = true;
option java_package = "dev.elide.proto.v1";
option java_string_check_utf8 = true;
option objc_class_prefix = "ELD";
option optimize_for = SPEED;
option php_class_prefix = "ELD";
option swift_prefix = "Elide";

// Enumeration of supported protocol versions.
enum ProtocolVersion {
  // Unspecified version.
  PROTOCOL_VERSION_UNSPECIFIED = 0;

  // Version 1 of the protocol.
  PROTOCOL_VERSION_V1 = 1;
}

// Enumeration of supported protocol formats.
enum ProtocolFormat {
  // Unspecified format.
  PROTOCOL_FORMAT_UNSPECIFIED = 0;

  // Cap'n Proto format, unpacked.
  PROTOCOL_FORMAT_CAPNPROTO = 1;

  // Cap'n Proto format, packed.
  PROTOCOL_FORMAT_CAPNPROTO_PACKED = 2;

  // Protocol Buffers binary format.
  PROTOCOL_FORMAT_PROTOBUF_BINARY = 3;
}

// Enumeration of known application environments.
enum AppEnvironment {
  // Unspecified environment.
  APP_ENVIRONMENT_UNSPECIFIED = 0;

  // Development environment.
  APP_ENVIRONMENT_DEVELOPMENT = 1;

  // Sandbox environment.
  APP_ENVIRONMENT_SANDBOX = 2;

  // Staging environment.
  APP_ENVIRONMENT_STAGING = 3;

  // Production environment.
  APP_ENVIRONMENT_PRODUCTION = 99;
}
```

### Defined Types
| Type | Kind | Values |
|------|------|--------|
| `ProtocolVersion` | enum | PROTOCOL_VERSION_UNSPECIFIED(0), PROTOCOL_VERSION_V1(1) |
| `ProtocolFormat` | enum | PROTOCOL_FORMAT_UNSPECIFIED(0), PROTOCOL_FORMAT_CAPNPROTO(1), PROTOCOL_FORMAT_CAPNPROTO_PACKED(2), PROTOCOL_FORMAT_PROTOBUF_BINARY(3) |
| `AppEnvironment` | enum | APP_ENVIRONMENT_UNSPECIFIED(0), APP_ENVIRONMENT_DEVELOPMENT(1), APP_ENVIRONMENT_SANDBOX(2), APP_ENVIRONMENT_STAGING(3), APP_ENVIRONMENT_PRODUCTION(99) |

---

## cli.capnp

**File ID:** `@0xccd8b69e5412e269`
**Java Package:** `dev.elide.proto.v1`
**Outer Class:** `CliProtocol`
**Imports:** sys.capnp (FilePath)

### Full Content (verbatim)
```capnp
@0xccd8b69e5412e269;

# Copyright (c) 2024-2025 Elide Technologies, Inc. All Rights Reserved.
# PROPRIETARY AND CONFIDENTIAL. This software may contain trade secrets and
# confidential information of Elide Technologies, Inc.
#
# UNAUTHORIZED USE, COPYING, DISTRIBUTION, OR DISCLOSURE IS STRICTLY PROHIBITED.
#
# No part of this software may be shared without prior written consent from
# Elide Technologies, Inc.
#
# Contact: engineering@elide.dev

using Java = import "/capnp/java.capnp";
using import "sys.capnp".FilePath;

$Java.package("dev.elide.proto.v1");
$Java.outerClassname("CliProtocol");

struct Argument {
  # Represents a command-line argument.

  key @0 :Text;
  # Argument name or key.

  value :union {
    noValue @1 :Void;
    # Argument has no associated value.

    singleValue @2 :Text;
    # Argument has a single associated string value.

    argFile @3 :FilePath;
    # Specifies a path to an argument file due for expansion.
  }
}

struct ArgumentSuite {
  # Represents a managed list of `Argument` entities.

  args :union {
    list @0 :List(Argument);
    # List of specified arguments.

    useArgv @1 :Bool;
    # Flag indicating that the program's argument vector should be used.
  }
}

struct ArgumentSlice {
  # Represents a known-valid slice within the program argument vector.

  offset @0 :UInt16;
  # Starting index (inclusive).

  count @1 :UInt16;
  # Count of extant arguments.
}

enum CliCommand {
  # Enumerates CLI subcommands supported by Elide.

  # Top-level commands
  init @0;
  info @1;
  run @2;
  serve @3;
  build @4;
  test @5;
  dev @6;
  format @7;
  project @8;
  classpath @9;
  install @10;
  lsp @11;
  mcp @12;

  # Embedded tools
  java @13;
  javac @14;
  javap @15;
  javadoc @16;
  kotlinc @17;
  nativeImage @18;
  jar @19;
  jib @20;
  javaformat @21;
  ktfmt @22;

  # Licensing
  pro @23;

  # Internal
  sidecar @24;

  # No command (top-level run)
  noCommand @25;
}
```

### Defined Types
| Type | Kind | Fields |
|------|------|--------|
| `Argument` | struct | key: Text, value: union(noValue, singleValue, argFile) |
| `ArgumentSuite` | struct | args: union(list, useArgv) |
| `ArgumentSlice` | struct | offset: UInt16, count: UInt16 |
| `CliCommand` | enum | 26 values (init through noCommand) |

---

## cli.proto

**Package:** `elide.v1`
**Imports:** elide/v1/env.proto, elide/v1/sys.proto

### Full Content (verbatim)
```protobuf
/*
 * Copyright (c) 2024-2025 Elide Technologies, Inc. All Rights Reserved.
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

syntax = "proto3";

package elide.v1;

import "elide/v1/env.proto";
import "elide/v1/sys.proto";

option cc_enable_arenas = true;
option csharp_namespace = "Elide.Protocol.v1";
option go_package = "github.com/elide-dev/elide/protocol/v1;elide_v1";
option java_multiple_files = true;
option java_package = "dev.elide.proto.v1";
option java_string_check_utf8 = true;
option objc_class_prefix = "ELD";
option optimize_for = SPEED;
option php_class_prefix = "ELD";
option swift_prefix = "Elide";

// Represents a command-line argument.
message Argument {
  // Key or name of the argument; raw argument string.
  string key = 1;

  // Value associated with the argument, if any.
  oneof value {
    // Single string value.
    string single_value = 2;

    // Argument file which is due for expansion.
    elide.v1.FilePath arg_file = 3;
  }
}
```

---

## env.capnp

**File ID:** `@0xac00ff49f69cbc0f`
**Java Package:** `dev.elide.proto.v1`
**Outer Class:** `EnvironmentProtocol`
**Imports:** base.capnp

### Full Content (verbatim)
```capnp
@0xac00ff49f69cbc0f;

# Copyright (c) 2024-2025 Elide Technologies, Inc. All Rights Reserved.
# PROPRIETARY AND CONFIDENTIAL. This software may contain trade secrets and
# confidential information of Elide Technologies, Inc.
#
# UNAUTHORIZED USE, COPYING, DISTRIBUTION, OR DISCLOSURE IS STRICTLY PROHIBITED.
#
# No part of this software may be shared without prior written consent from
# Elide Technologies, Inc.
#
# Contact: engineering@elide.dev

using Java = import "/capnp/java.capnp";
using Base = import "base.capnp";

$Java.package("dev.elide.proto.v1");
$Java.outerClassname("EnvironmentProtocol");

enum EnvironmentSourceType {
  # Enumeration of sources for environment variables.

  unspecified @0;
  # Unspecified source.

  system @1;
  # System environment variables.

  dotenv @2;
  # User-defined environment variables in dotenv files.

  injected @3;
  # Injected at runtime by Elide.
}

struct EnvironmentSource {
  # Represents the source of an environment variable.

  type @0 :EnvironmentSourceType;
  # The type of source.

  description @1 :Text;
    # A human-readable description of the source.

  context :union {
    # Additional source context.

    noContext @2 :Void;
    # No additional context.

    dotenvFile @3 :Text;
    # The path to the dotenv file from which the variable was loaded.
  }
}

struct EnvironmentVariable {
  # Represents an environment variable as a key-value pair.

  key @0 :Text;
  # The name of the environment variable.

  value @1 :Text;
  # The value of the environment variable.

  source @2 :EnvironmentSource;
  # The source from which this environment variable was obtained.
}

struct EnvironmentMap {
  # Map of environment variables.

  size @0 :UInt32;
  # Number of environment variables in the map.

  vars @1 :List(EnvironmentVariable);
  # The environment variables map.
}
```

### Defined Types
| Type | Kind | Fields |
|------|------|--------|
| `EnvironmentSourceType` | enum | unspecified(0), system(1), dotenv(2), injected(3) |
| `EnvironmentSource` | struct | type, description, context: union(noContext, dotenvFile) |
| `EnvironmentVariable` | struct | key, value, source |
| `EnvironmentMap` | struct | size, vars: List(EnvironmentVariable) |

---

## env.proto

**Package:** `elide.v1`

### Full Content (verbatim)
```protobuf
/*
 * Copyright (c) 2024-2025 Elide Technologies, Inc. All Rights Reserved.
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

syntax = "proto3";

package elide.v1;

option cc_enable_arenas = true;
option csharp_namespace = "Elide.Protocol.v1";
option go_package = "github.com/elide-dev/elide/protocol/v1;elide_v1";
option java_multiple_files = true;
option java_package = "dev.elide.proto.v1";
option java_string_check_utf8 = true;
option objc_class_prefix = "ELD";
option optimize_for = SPEED;
option php_class_prefix = "ELD";
option swift_prefix = "Elide";

// Sources of environment variables.
enum EnvironmentSourceType {
  // Unspecified.
  ENVIRONMENT_SOURCE_TYPE_UNSPECIFIED = 0;

  // System environment variables.
  ENVIRONMENT_SOURCE_TYPE_SYSTEM = 1;

  // Dotenv-provided environment variables.
  ENVIRONMENT_SOURCE_TYPE_DOTENV = 2;

  // Dotenv-provided environment variables.
  ENVIRONMENT_SOURCE_TYPE_INJECTED = 3;
}

// Source information for an environment variable.
message EnvironmentSource {
  // Type of source.
  EnvironmentSourceType type = 1;

  // Description of this source.
  string description = 2;

  // Additional source context.
  oneof context {
    // Dotenv file path.
    string dotenv_file = 3;
  }
}

// Describes a single environment variable.
message EnvironmentVariable {
  // Name/key of the environment variable.
  string key = 1;

  // Value held by the environment variable.
  string value = 2;

  // Source information for this environment variable.
  EnvironmentSource source = 3;
}

// Map of active materialized environment variables.
message EnvironmentMap {
  // Size of the environment map.
  uint32 size = 1;

  // All environment variables.
  repeated EnvironmentVariable vars = 2;
}
```

---

## url.capnp

**File ID:** `@0xaa01e7a2eaee812c`
**Java Package:** `dev.elide.proto.v1`
**Outer Class:** `UrlProtocol`

### Full Content (verbatim)
```capnp
@0xaa01e7a2eaee812c;

# Copyright (c) 2024-2025 Elide Technologies, Inc. All Rights Reserved.
# PROPRIETARY AND CONFIDENTIAL. This software may contain trade secrets and
# confidential information of Elide Technologies, Inc.
#
# UNAUTHORIZED USE, COPYING, DISTRIBUTION, OR DISCLOSURE IS STRICTLY PROHIBITED.
#
# No part of this software may be shared without prior written consent from
# Elide Technologies, Inc.
#
# Contact: engineering@elide.dev

using Java = import "/capnp/java.capnp";

$Java.package("dev.elide.proto.v1");
$Java.outerClassname("UrlProtocol");

struct URL {
  # Models a parsed URL string.
}
```

---

## url.proto

**Package:** `elide.v1`

### Full Content (verbatim)
```protobuf
/*
 * Copyright (c) 2024-2025 Elide Technologies, Inc. All Rights Reserved.
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

syntax = "proto3";

package elide.v1;

option cc_enable_arenas = true;
option csharp_namespace = "Elide.Protocol.v1";
option go_package = "github.com/elide-dev/elide/protocol/v1;elide_v1";
option java_multiple_files = true;
option java_package = "dev.elide.proto.v1";
option java_string_check_utf8 = true;
option objc_class_prefix = "ELD";
option optimize_for = SPEED;
option php_class_prefix = "ELD";
option swift_prefix = "Elide";

// Models a parsed URL string.
message URL {}
```

---

## http.capnp

**File ID:** `@0xf33da84cc89c81c5`
**Java Package:** `dev.elide.proto.v1`
**Outer Class:** `HttpProtocol`
**Imports:** url.capnp (URL)

### Full Content (verbatim)
```capnp
@0xf33da84cc89c81c5;

# Copyright (c) 2024-2025 Elide Technologies, Inc. All Rights Reserved.
# PROPRIETARY AND CONFIDENTIAL. This software may contain trade secrets and
# confidential information of Elide Technologies, Inc.
#
# UNAUTHORIZED USE, COPYING, DISTRIBUTION, OR DISCLOSURE IS STRICTLY PROHIBITED.
#
# No part of this software may be shared without prior written consent from
# Elide Technologies, Inc.
#
# Contact: engineering@elide.dev

using Java = import "/capnp/java.capnp";
using import "url.capnp".URL;

$Java.package("dev.elide.proto.v1");
$Java.outerClassname("HttpProtocol");

enum HttpVersion {
  # Enumeration of supported HTTP versions.

  unspecified @0;
  # Unspecified HTTP version.

  http10 @1;
  # HTTP/1.0 version.

  http11 @2;
  # HTTP/1.1 version.

  http20 @3;
  # HTTP/2.0 version.

  http30 @4;
  # HTTP/3.0 version.
}

enum HttpMethod {
  # Enumeration of standard (spec) HTTP methods.

  unspecified @0;
  # Unspecified HTTP method.

  get @1;
  # HTTP GET method.

  post @2;
  # HTTP POST method.

  put @3;
  # HTTP PUT method.

  delete @4;
  # HTTP DELETE method.

  patch @5;
  # HTTP PATCH method.

  head @6;
  # HTTP HEAD method.

  options @7;
  # HTTP OPTIONS method.
}

struct HttpHeader {
  # Models a single HTTP header key-value pair.

  key @0 :Text;
  # Header key/name.

  value @1 :Text;
  # Header value.
}

struct HttpHeaders {
  # Models HTTP headers as a repetitive map of key-value pairs.

  size @0 :UInt32;
  # Number of headers present.

  entries @1 :List(HttpHeader);
  # List of HTTP header entries.
}

struct HttpBody {
  # Models a payload of HTTP body data.

  length @0 :UInt64;
  # Length of the body data, in bytes.

  contentType @1 :Text;
  # MIME content type of the body data.

  data @2 :Data;
  # Raw body data.
}

struct HttpConnectionMetadata {
  # Metadata about the HTTP connection.

  keepAlive @0 :Bool;
  # Whether the connection is keep-alive.

  secure @1 :Bool;
  # Whether the connection is secure (HTTPS/TLS).
}

struct HttpRequest {
  version @0 :HttpVersion;
  # HTTP version.

  connection @1 :HttpConnectionMetadata;
  # HTTP connection metadata.

  method :union {
    standard @2 :HttpMethod;
    # Standard HTTP method.

    custom @3 :Text;
    # Custom HTTP method.
  }

  url @4 :URL;
  # Parsed request URL.

  headers @5 :HttpHeaders;
  # HTTP request headers.

  body :union {
    empty @6 :Void;
    # No payload present.

    payload @7 :HttpBody;
    # HTTP payload data.
  }

  trailers @8 :HttpHeaders;
  # HTTP request trailers.
}

struct HttpStatus {
  # Models an HTTP response status.

  code @0 :UInt16;
  # HTTP status code.

  message @1 :Text;
  # HTTP status message.
}

struct HttpResponse {
  version @0 :HttpVersion;
  # HTTP version.

  connection @1 :HttpConnectionMetadata;
  # HTTP connection metadata.

  status @2 :HttpStatus;
  # HTTP response status.

  headers @3 :HttpHeaders;
  # HTTP response headers.

  body :union {
    empty @4 :Void;
    # No payload present.

    payload @5 :HttpBody;
    # HTTP payload data.
  }

  trailers @6 :HttpHeaders;
  # HTTP response trailers.
}

struct HttpUnaryExchange {
  # Models an HTTP exchange with a request and response.

  request @0 :HttpRequest;
  # HTTP request.

  response @1 :HttpResponse;
  # HTTP response.
}
```

### Defined Types
| Type | Kind | Fields |
|------|------|--------|
| `HttpVersion` | enum | unspecified(0), http10(1), http11(2), http20(3), http30(4) |
| `HttpMethod` | enum | unspecified(0), get(1), post(2), put(3), delete(4), patch(5), head(6), options(7) |
| `HttpHeader` | struct | key, value |
| `HttpHeaders` | struct | size, entries: List(HttpHeader) |
| `HttpBody` | struct | length, contentType, data |
| `HttpConnectionMetadata` | struct | keepAlive, secure |
| `HttpRequest` | struct | version, connection, method: union(standard, custom), url, headers, body: union(empty, payload), trailers |
| `HttpStatus` | struct | code, message |
| `HttpResponse` | struct | version, connection, status, headers, body: union(empty, payload), trailers |
| `HttpUnaryExchange` | struct | request, response |

---

## http.proto

**Package:** `elide.v1`
**Imports:** elide/v1/url.proto

### Full Content (verbatim)
```protobuf
/*
 * Copyright (c) 2024-2025 Elide Technologies, Inc. All Rights Reserved.
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

syntax = "proto3";

package elide.v1;

import "elide/v1/url.proto";

option cc_enable_arenas = true;
option csharp_namespace = "Elide.Protocol.v1";
option go_package = "github.com/elide-dev/elide/protocol/v1;elide_v1";
option java_multiple_files = true;
option java_package = "dev.elide.proto.v1";
option java_string_check_utf8 = true;
option objc_class_prefix = "ELD";
option optimize_for = SPEED;
option php_class_prefix = "ELD";
option swift_prefix = "Elide";

// HTTP version enumeration.
enum HttpVersion {
  // Unspecified HTTP version.
  HTTP_VERSION_UNSPECIFIED = 0;

  // HTTP/1 version.
  HTTP_1_0 = 1;

  // HTTP/1.1 version.
  HTTP_1_1 = 2;

  // HTTP/2 version.
  HTTP_2 = 3;

  // HTTP/3 version.
  HTTP_3 = 4;
}

// Enumerates supported HTTP methods.
enum HttpMethod {
  // Unspecified HTTP method.
  HTTP_METHOD_UNSPECIFIED = 0;

  // HTTP GET method.
  HTTP_GET = 1;

  // HTTP POST method.
  HTTP_POST = 2;

  // HTTP PUT method.
  HTTP_PUT = 3;

  // HTTP DELETE method.
  HTTP_DELETE = 4;

  // HTTP PATCH method.
  HTTP_PATCH = 5;

  // HTTP HEAD method.
  HTTP_HEAD = 6;

  // HTTP OPTIONS method.
  HTTP_OPTIONS = 7;
}

// Models a single HTTP header.
message HttpHeader {}

// Models a suite of HTTP headers.
message HttpHeaders {}

// Models an HTTP body payload.
message HttpBody {}

// Models metadata about the HTTP connection.
message HttpConnectionMetadata {}

// HTTP request.
message HttpRequest {}

// HTTP response status.
message HttpStatus {}

// HTTP response.
message HttpResponse {}

// Models a unary HTTP exchange (request + response).
message HttpUnaryExchange {}
```

---

## sys.capnp

**File ID:** `@0xce63a482a90ce451`
**Java Package:** `dev.elide.proto.v1`
**Outer Class:** `SysProtocol`

### Full Content (verbatim)
```capnp
@0xce63a482a90ce451;

# Copyright (c) 2024-2025 Elide Technologies, Inc. All Rights Reserved.
# PROPRIETARY AND CONFIDENTIAL. This software may contain trade secrets and
# confidential information of Elide Technologies, Inc.
#
# UNAUTHORIZED USE, COPYING, DISTRIBUTION, OR DISCLOSURE IS STRICTLY PROHIBITED.
#
# No part of this software may be shared without prior written consent from
# Elide Technologies, Inc.
#
# Contact: engineering@elide.dev

using Java = import "/capnp/java.capnp";

$Java.package("dev.elide.proto.v1");
$Java.outerClassname("SysProtocol");

struct PathString {
  # Represents a filesystem path as a raw string.

  path @0 :Text;
  # The raw path string.
}

struct FilePath {
  # Represents a path to a regular file.

  pathString @0 :PathString;
  # Path represented as a raw string.
}

struct DirectoryPath {
  # Represents a path to a directory.

  pathString @0 :PathString;
  # Path represented as a raw string.
}

struct Path {
  # Represents a filesystem path, which may be a file or directory.

  target :union {
    file @0 :FilePath;
    # Path to a regular file.

    directory @1 :DirectoryPath;
    # Path to a directory.
  }
}

struct FileHandle {
  # Low-level handle to a file.

  handle @0 :UInt64;
  # Numeric handle identifier.

  stat @1 :FileStat;
  # Metadata about the file, as applicable.
}

struct FileStat {
  # Metadata about a file.

  sizeBytes @0 :UInt64;
  # Size of the file in bytes.

  isDirectory @1 :Bool;
  # Whether the file is a directory.

  isRegularFile @2 :Bool;
  # Whether the file is a regular file.

  createdAt @3 :UInt64;
  # Creation timestamp (epoch milliseconds).

  modifiedAt @4 :UInt64;
  # Last modified timestamp (epoch milliseconds).
}

struct Directory {
  # Handle to a directory.

  path @0 :DirectoryPath;
  # Path to the directory.

  handle @1 :FileHandle;
  # Handle to the directory.
}

struct File {
  # Handle to a file.

  path @0 :FilePath;
  # Path to the file.

  handle @1 :FileHandle;
  # Handle to the file.
}

struct Port {
  # Specific or random network port.

  value :union {
    assigned @0 :UInt16;
    # Specific port number.

    random @1 :Void;
    # Randomly assigned port.
  }

  effective @2 :UInt16;
  # Effective port number in use, as applicable.
}

struct SocketHandle {
  # Low-level handle to a socket.

  handle @0 :UInt64;
  # Numeric handle identifier.
}

struct IPv4Address {
  # Represents an IPv4 address.

  octet1 @0 :UInt8;
  # First octet.

  octet2 @1 :UInt8;
  # Second octet.

  octet3 @2 :UInt8;
  # Third octet.

  octet4 @3 :UInt8;
  # Fourth octet.
}

struct IPv6Address {
  # Represents an IPv6 address.

  segment1 @0 :UInt16;
  # First segment.

  segment2 @1 :UInt16;
  # Second segment.

  segment3 @2 :UInt16;
  # Third segment.

  segment4 @3 :UInt16;
  # Fourth segment.

  segment5 @4 :UInt16;
  # Fifth segment.

  segment6 @5 :UInt16;
  # Sixth segment.

  segment7 @6 :UInt16;
  # Seventh segment.

  segment8 @7 :UInt16;
  # Eighth segment.
}

struct IPAddress {
  # Represents an IP address.

  address :union {
    ipv4 @0 :IPv4Address;
    # IPv4 address.

    ipv6 @1 :IPv6Address;
    # IPv6 address.
  }
}

struct SocketAddress {
  # Represents a socket address.

  ip @0 :IPAddress;
  # IP address.

  port @1 :Port;
  # Port number.
}

struct Socket {
  # Handle to a socket.

  address @0 :SocketAddress;
  # Address of the socket.

  handle @1 :SocketHandle;
  # Handle to the socket.

  file @2 :File;
  # Underlying file for the socket, as applicable.
}
```

### Defined Types
| Type | Kind | Fields |
|------|------|--------|
| `PathString` | struct | path: Text |
| `FilePath` | struct | pathString |
| `DirectoryPath` | struct | pathString |
| `Path` | struct | target: union(file, directory) |
| `FileHandle` | struct | handle: UInt64, stat |
| `FileStat` | struct | sizeBytes, isDirectory, isRegularFile, createdAt, modifiedAt |
| `Directory` | struct | path, handle |
| `File` | struct | path, handle |
| `Port` | struct | value: union(assigned, random), effective |
| `SocketHandle` | struct | handle: UInt64 |
| `IPv4Address` | struct | octet1-4: UInt8 |
| `IPv6Address` | struct | segment1-8: UInt16 |
| `IPAddress` | struct | address: union(ipv4, ipv6) |
| `SocketAddress` | struct | ip, port |
| `Socket` | struct | address, handle, file |

---

## sys.proto

**Package:** `elide.v1`
**Imports:** elide/v1/env.proto, google/protobuf/timestamp.proto

### Full Content (verbatim)
```protobuf
/*
 * Copyright (c) 2024-2025 Elide Technologies, Inc. All Rights Reserved.
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

syntax = "proto3";

package elide.v1;

import "elide/v1/env.proto";
import "google/protobuf/timestamp.proto";

option cc_enable_arenas = true;
option csharp_namespace = "Elide.Protocol.v1";
option go_package = "github.com/elide-dev/elide/protocol/v1;elide_v1";
option java_multiple_files = true;
option java_package = "dev.elide.proto.v1";
option java_string_check_utf8 = true;
option objc_class_prefix = "ELD";
option optimize_for = SPEED;
option php_class_prefix = "ELD";
option swift_prefix = "Elide";

// Holds a raw file or directory path as a string.
message PathString {
  // Raw path string.
  string path = 1;
}

// Holds a validated path to a regular file.
message FilePath {
  // Path in string form.
  PathString path_string = 1;
}

// Holds a validated path to a directory.
message DirectoryPath {
  // Path in string form.
  PathString path_string = 1;
}

// Holds some kind of file path.
message Path {
  oneof target {
    // Regular file path.
    FilePath file = 1;

    // Directory path.
    DirectoryPath directory = 2;
  }
}

// Low-level handle to a file.
message FileHandle {
  // Numeric handle identifier.
  uint64 handle = 1;

  // Metadata about the file, as applicable.
  FileStat stat = 2;
}

// Metadata about a file.
message FileStat {
  // Size of the file in bytes.
  uint64 size_bytes = 1;

  // Whether the file is a directory.
  bool is_directory = 2;

  // Whether the file is a regular file.
  bool is_file = 3;

  // File creation time.
  google.protobuf.Timestamp created_at = 4;

  // File modification time.
  google.protobuf.Timestamp modified_at = 5;
}

// Represents a directory in the filesystem.
message Directory {
  // Path to the directory.
  DirectoryPath path = 1;

  // Handle to the directory.
  FileHandle handle = 2;
}

// Represents a file in the filesystem.
message File {
  // Path to the file.
  FilePath path = 1;

  // Handle to the file.
  FileHandle handle = 2;
}

// Represents a network port.
message Port {
  // Assigned or random.
  oneof value {
    // Specific port number.
    uint32 assigned = 1;

    // Randomly assigned port.
    bool random = 2;
  }

  // Effective port.
  uint32 effective = 3;
}

// Low-level handle to a socket.
message SocketHandle {
  // Numeric handle identifier.
  uint64 handle = 1;
}

// Models an IPv4 address.
message IPv4Address {
  // Octet 1.
  uint32 octet1 = 1;

  // Octet 2.
  uint32 octet2 = 2;

  // Octet 3.
  uint32 octet3 = 3;

  // Octet 4.
  uint32 octet4 = 4;
}

// Models an IPv6 address.
message IPv6Address {
  // Octet 1.
  uint32 octet1 = 1;

  // Octet 2.
  uint32 octet2 = 2;

  // Octet 3.
  uint32 octet3 = 3;

  // Octet 4.
  uint32 octet4 = 4;

  // Octet 5.
  uint32 octet5 = 5;

  // Octet 6.
  uint32 octet6 = 6;

  // Octet 7.
  uint32 octet7 = 7;

  // Octet 8.
  uint32 octet8 = 8;
}

// Models an IP address of some kind.
message IPAddress {
  oneof address {
    // IPv4 address.
    IPv4Address ipv4 = 1;

    // IPv6 address.
    IPv6Address ipv6 = 2;
  }
}

// Represents a network socket address.
message SocketAddress {
  // IP address as a string.
  IPAddress ip = 1;

  // Port number.
  Port port = 2;
}

// Represents a network socket of some kind.
message Socket {
  // Address of the socket.
  SocketAddress address = 1;

  // Handle to the socket.
  SocketHandle handle = 2;

  // Underlying file for the socket, as applicable.
  File file = 3;
}
```

---

## tools.capnp

**File ID:** `@0xdc8d6251ad7d70f8`
**Java Package:** `dev.elide.proto.v1`
**Outer Class:** `ToolsProtocol`
**Imports:** cli.capnp (Argument, ArgumentSlice)

### Full Content (verbatim)
```capnp
@0xdc8d6251ad7d70f8;

# Copyright (c) 2024-2025 Elide Technologies, Inc. All Rights Reserved.
# PROPRIETARY AND CONFIDENTIAL. This software may contain trade secrets and
# confidential information of Elide Technologies, Inc.
#
# UNAUTHORIZED USE, COPYING, DISTRIBUTION, OR DISCLOSURE IS STRICTLY PROHIBITED.
#
# No part of this software may be shared without prior written consent from
# Elide Technologies, Inc.
#
# Contact: engineering@elide.dev

using Java = import "/capnp/java.capnp";
using import "cli.capnp".Argument;
using import "cli.capnp".ArgumentSlice;

$Java.package("dev.elide.proto.v1");
$Java.outerClassname("ToolsProtocol");

enum EmbeddedTool {
  # Enumeration of supported embedded tools.

  unspecified @0;
  # Unspecified tool.

  javac @1;
  # Java compiler tool.

  kotlinc @2;
  # Kotlin compiler tool.

  jar @3;
  # Java Archive tool.

  javadoc @4;
  # Javadoc tool.

  javap @5;
  # Java class file disassembler tool.

  googleJavaFormat @6;
  # Google Java Format tool.

  ktfmt @7;
  # Kotlin Format tool.

  nativeImage @8;
  # GraalVM Native Image tool.

  jib @9;
  # Jib container builder.
}

struct ToolInvocation {
  # Models an embedded tool command invocation.

  tool @0 :EmbeddedTool;
  # The embedded tool being invoked.

  toolArgs @1 :ArgumentSlice;
  # Dedicated arguments passed to the embedded tool not otherwise present in the argument vector.
}
```

### Defined Types
| Type | Kind | Values/Fields |
|------|------|---------------|
| `EmbeddedTool` | enum | unspecified(0), javac(1), kotlinc(2), jar(3), javadoc(4), javap(5), googleJavaFormat(6), ktfmt(7), nativeImage(8), jib(9) |
| `ToolInvocation` | struct | tool, toolArgs |

---

## tools.proto

**Package:** `elide.v1`
**Imports:** elide/v1/cli.proto, elide/v1/env.proto

### Full Content (verbatim)
```protobuf
/*
 * Copyright (c) 2024-2025 Elide Technologies, Inc. All Rights Reserved.
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

syntax = "proto3";

package elide.v1;

import "elide/v1/cli.proto";
import "elide/v1/env.proto";

option cc_enable_arenas = true;
option csharp_namespace = "Elide.Protocol.v1";
option go_package = "github.com/elide-dev/elide/protocol/v1;elide_v1";
option java_multiple_files = true;
option java_package = "dev.elide.proto.v1";
option java_string_check_utf8 = true;
option objc_class_prefix = "ELD";
option optimize_for = SPEED;
option php_class_prefix = "ELD";
option swift_prefix = "Elide";

// Enumerates tools supported by Elide.
enum EmbeddedTool {
  // No tool specified.
  EMBEDDED_TOOL_UNSPECIFIED = 0;

  // Java compiler.
  EMBEDDED_TOOL_JAVAC = 1;

  // Kotlin compiler.
  EMBEDDED_TOOL_KOTLINC = 2;

  // Java Archive tool.
  EMBEDDED_TOOL_JAR = 3;

  // Javadoc tool.
  EMBEDDED_TOOL_JAVADOC = 4;

  // Java class disassembler.
  EMBEDDED_TOOL_JAVAP = 5;

  // Google's Java formatter.
  EMBEDDED_TOOL_GOOGLE_JAVA_FORMAT = 6;

  // Meta's Kotlin formatter.
  EMBEDDED_TOOL_KTFMT = 7;

  // Native Image compiler.
  EMBEDDED_TOOL_NATIVE_IMAGE = 8;

  // Jib container builder.
  EMBEDDED_TOOL_JIB = 9;
}

// Represents an invocation of an embedded tool.
message ToolInvocation {
  // Tool to invoke.
  EmbeddedTool tool = 1;

  // Offset into the program argument vector where arguments for the embedded tool begin.
  uint32 tool_arg_offset = 2;

  // Arguments to pass to the tool
  repeated elide.v1.Argument args = 3;
}
```

---

## engine.capnp

**File ID:** `@0xdbf7a17f31dc03d3`
**Java Package:** `dev.elide.proto.v1`
**Outer Class:** `EngineProtocol`

### Full Content (verbatim)
```capnp
@0xdbf7a17f31dc03d3;

# Copyright (c) 2024-2025 Elide Technologies, Inc. All Rights Reserved.
# PROPRIETARY AND CONFIDENTIAL. This software may contain trade secrets and
# confidential information of Elide Technologies, Inc.
#
# UNAUTHORIZED USE, COPYING, DISTRIBUTION, OR DISCLOSURE IS STRICTLY PROHIBITED.
#
# No part of this software may be shared without prior written consent from
# Elide Technologies, Inc.
#
# Contact: engineering@elide.dev

using Java = import "/capnp/java.capnp";

$Java.package("dev.elide.proto.v1");
$Java.outerClassname("EngineProtocol");

enum EngineFlag {
  # Flags which can be passed to the engine during initialization.

  unknown @0;
  # Unknown engine flag.

  engineOptimized @1;
  # Enables the optimized engine (JIT-enabled).

  engineIsolate @2;
  # Enables isolated execution.

  engineEpsilon @3;
  # Enables "epsilon" mode, which disables GC.
}

enum Language {
  # Enumeration of supported languages (known).

  unknown @0;
  # Unknown language.

  javascript @1;
  # JavaScript language.

  typescript @2;
  # TypeScript language.

  wasm @3;
  # WebAssembly language.

  python @4;
  # Python language.

  ruby @5;
  # Ruby language.

  java @6;
  # Java language.

  kotlin @7;
  # Kotlin language.
}

struct EngineConfig {
  # Configuration options for the engine.

  flags @0 :List(EngineFlag);
  # Enabled engine flags.

  languages @1 :List(Language);
  # Languages for the engine; if none are specified, the default suite is enabled.
}

struct Languages {
  # List of languages.

  languages @0 :List(Language);
  # List of languages.
}
```

### Defined Types
| Type | Kind | Values/Fields |
|------|------|---------------|
| `EngineFlag` | enum | unknown(0), engineOptimized(1), engineIsolate(2), engineEpsilon(3) |
| `Language` | enum | unknown(0), javascript(1), typescript(2), wasm(3), python(4), ruby(5), java(6), kotlin(7) |
| `EngineConfig` | struct | flags: List(EngineFlag), languages: List(Language) |
| `Languages` | struct | languages: List(Language) |

---

## engine.proto

**Package:** `elide.v1`

### Full Content (verbatim)
```protobuf
/*
 * Copyright (c) 2024-2025 Elide Technologies, Inc. All Rights Reserved.
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

syntax = "proto3";

package elide.v1;

option cc_enable_arenas = true;
option csharp_namespace = "Elide.Protocol.v1";
option go_package = "github.com/elide-dev/elide/protocol/v1;elide_v1";
option java_multiple_files = true;
option java_package = "dev.elide.proto.v1";
option java_string_check_utf8 = true;
option objc_class_prefix = "ELD";
option optimize_for = SPEED;
option php_class_prefix = "ELD";
option swift_prefix = "Elide";

// Flags which can be passed to the engine during initialization.
enum EngineFlag {
  // Default value: unknown flag.
  ENGINE_FLAG_UNKNOWN = 0;

  // Enable the optimized runtime (JIT).
  ENGINE_OPTIMIZED = 1;

  // Enable isolated execution.
  ENGINE_ISOLATE = 2;

  // Enable Epsilon mode (no GC).
  ENGINE_EPSILON = 3;
}

// Enumeration of supported languages (known).
enum Language {
  // Unknown language.
  LANGUAGE_UNKNOWN = 0;

  // JavaScript.
  LANGUAGE_JAVASCRIPT = 1;

  // TypeScript.
  LANGUAGE_TYPESCRIPT = 2;

  // WebAssembly.
  LANGUAGE_WASM = 3;

  // Python.
  LANGUAGE_PYTHON = 4;

  // Ruby.
  LANGUAGE_RUBY = 5;

  // Java.
  LANGUAGE_JAVA = 6;

  // Kotlin.
  LANGUAGE_KOTLIN = 7;
}

// Specifies configuration which governs Elide's core engine.
message EngineConfig {
  // Flags to apply to the engine.
  repeated EngineFlag flag = 1;

  // Languages to enable; if none are specified, the default suite is enabled.
  repeated Language language = 2;
}
```

---

## invocation.capnp

**File ID:** `@0xe123c205d2399ae0`
**Java Package:** `dev.elide.proto.v1`
**Outer Class:** `InvocationProtocol`
**Imports:** base.capnp, http.capnp, tools.capnp, sys.capnp, cli.capnp, env.capnp, engine.capnp

### Full Content (verbatim)
```capnp
@0xe123c205d2399ae0;

# Copyright (c) 2024-2025 Elide Technologies, Inc. All Rights Reserved.
# PROPRIETARY AND CONFIDENTIAL. This software may contain trade secrets and
# confidential information of Elide Technologies, Inc.
#
# UNAUTHORIZED USE, COPYING, DISTRIBUTION, OR DISCLOSURE IS STRICTLY PROHIBITED.
#
# No part of this software may be shared without prior written consent from
# Elide Technologies, Inc.
#
# Contact: engineering@elide.dev

using Java = import "/capnp/java.capnp";
using Base = import "base.capnp";
using Http = import "http.capnp";
using Tools = import "tools.capnp";
using System = import "sys.capnp";
using import "cli.capnp".Argument;
using import "cli.capnp".ArgumentSuite;
using import "cli.capnp".ArgumentSlice;
using import "cli.capnp".CliCommand;
using import "env.capnp".EnvironmentMap;
using import "sys.capnp".FilePath;
using import "engine.capnp".EngineConfig;

$Java.package("dev.elide.proto.v1");
$Java.outerClassname("InvocationProtocol");

struct FileRunInvocation {
  # Invocation of a script or file.

  filepath @0 :System.FilePath;
  # Path to the script or file being executed.
}

struct EngineInvocation {
  # Invocation of the Elide command-line binary, described as a structure.

  binpath @0 :Text;
  # Path to the Elide binary being invoked.

  args @1 :ArgumentSuite;
  # Arguments passed to the Elide binary as part of this invocation.

  env @2 :EnvironmentMap;
  # Environment variables set for this invocation.

  meta @3 :InvocationMetadata;
  # Additional metadata about this invocation.

  reserved1 @4 :Void;
  reserved2 @5 :Void;

  struct InvocationMetadata {
    # Attaches arbitrary metadata to an invocation.

    appEnvironment @0 :Base.AppEnvironment;
    # Application environment type in which the invocation is being executed.

    engineConfig @1 :EngineConfig;
    # Engine configuration used for this invocation.
  }

  struct CliInvocation {
    # Models a command-line invocation.

    struct GlobalFlags {
      # Global command-line flags applicable across all commands.

      debug @0 :Bool;
      # Debug mode enabled.

      quiet @1 :Bool;
      # Quiet output mode.

      noColor @2 :Bool;
      # Disable colored output.

      crash @3 :Bool;
      # Crash immediately (for testing).

      noNative @4 :Bool;
      # Disable native access.

      noTelemetry @5 :Bool;
      # Disable telemetry.
    }

    enum RunMode {
      # Enumerates run modes for CLI runner invocations.

      unspecified @0;
      # Unspecified run mode.

      standard @1;
      # Standard run mode.

      interactive @2;
      # Interactive mode.

      serve @3;
      # Server mode.
    }

    struct ListenHost {
      # Host and port configuration for server mode.

      host @0 :Text;
      # Hostname or IP address to bind the server to.

      port @1 :System.Port;
      # Port number to bind the server to.
    }

    struct ServerConfig {
      # Configuration for server mode.

      listener :union {
        hostPort @0 :ListenHost;
        # Host and port to listen on.

        socket @1 :System.Socket;
        # Pre-existing socket to bind to.
      }
    }

    struct RunInvocation {
      # Models a 'run' command invocation.

      sourceCode :union {
        # Source code input for the 'run' command.

        file @0 :FileRunInvocation;
        # File or script being run.

        code @1 :Text;
        # Inline code being executed.
      }

      mode @2 :RunMode;
      # Run mode for this invocation.

      server @3 :ServerConfig;
      # Server configuration, as applicable, when `mode` is `serve`.

      scriptArgs @4 :ArgumentSlice;
      # Arguments passed to the script being run.
    }

    command :union {
      # CLI command being invoked.

      run @0 :RunInvocation;
      # 'run', 'serve', etc. command invocation.

      tool @1 :Tools.ToolInvocation;
      # Embedded tool invocation.
    }

    subcommand @2 :CliCommand;
    # The parsed subcommand from CLI argument parsing.

    flags @3 :GlobalFlags;
    # Global command-line flags.
  }

  struct HttpInvocation {
    # Models an HTTP request as an invocation.

    requestId @0 : Int64;
    # Unique identifier for the HTTP invocation.

    request @1 : Http.HttpRequest;
    # HTTP request.
  }

  invocation :union {
    # Invocation context enhancement.

    noContext @6 :Void;
    # No additional context enhancement.

    cli @7 :CliInvocation;
    # Invocation enhancement in a CLI context.

    http @8 :HttpInvocation;
    # Invocation enhancement over HTTP.
  }
}
```

### Defined Types
| Type | Kind | Fields |
|------|------|--------|
| `FileRunInvocation` | struct | filepath |
| `EngineInvocation` | struct | binpath, args, env, meta, reserved1-2, invocation: union |
| `EngineInvocation.InvocationMetadata` | struct | appEnvironment, engineConfig |
| `EngineInvocation.CliInvocation` | struct | command: union, subcommand, flags |
| `EngineInvocation.CliInvocation.GlobalFlags` | struct | debug, quiet, noColor, crash, noNative, noTelemetry |
| `EngineInvocation.CliInvocation.RunMode` | enum | unspecified(0), standard(1), interactive(2), serve(3) |
| `EngineInvocation.CliInvocation.ListenHost` | struct | host, port |
| `EngineInvocation.CliInvocation.ServerConfig` | struct | listener: union(hostPort, socket) |
| `EngineInvocation.CliInvocation.RunInvocation` | struct | sourceCode: union, mode, server, scriptArgs |
| `EngineInvocation.HttpInvocation` | struct | requestId, request |

---

## invocation.proto

**Package:** `elide.v1`
**Imports:** base.proto, cli.proto, engine.proto, env.proto, sys.proto, tools.proto

### Full Content (verbatim)
```protobuf
/*
 * Copyright (c) 2024-2025 Elide Technologies, Inc. All Rights Reserved.
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

syntax = "proto3";

package elide.v1;

import "elide/v1/base.proto";
import "elide/v1/cli.proto";
import "elide/v1/engine.proto";
import "elide/v1/env.proto";
import "elide/v1/sys.proto";
import "elide/v1/tools.proto";

option cc_enable_arenas = true;
option csharp_namespace = "Elide.Protocol.v1";
option go_package = "github.com/elide-dev/elide/protocol/v1;elide_v1";
option java_multiple_files = true;
option java_package = "dev.elide.proto.v1";
option java_string_check_utf8 = true;
option objc_class_prefix = "ELD";
option optimize_for = SPEED;
option php_class_prefix = "ELD";
option swift_prefix = "Elide";

// Invocation of a script or file.
message FileRunInvocation {
  // Path to the script or file being executed.
  FilePath filepath = 1;
}

// Invocation of the Elide command-line binary, described as a structure.
message EngineInvocation {
  // Binary path.
  string binpath = 1;

  // Arguments to pass to Elide.
  repeated Argument args = 2;

  // Environment map to use.
  EnvironmentMap env = 3;

  // Metadata about this invocation.
  InvocationMetadata meta = 4;

  // Models metadata about an invocation.
  message InvocationMetadata {
    // Application environment type in which the invocation is being executed.
    AppEnvironment app_environment = 1;

    // Engine configuration to apply.
    EngineConfig engine_config = 2;
  }

  // Models a command-line invocation.
  message CliInvocation {
    // Enumerates extended run modes.
    enum RunMode {
      // Default run mode.
      RUN_MODE_UNSPECIFIED = 0;

      // Standard execution mode.
      RUN_MODE_STANDARD = 1;

      // Interactive mode.
      RUN_MODE_INTERACTIVE = 2;

      // Server mode.
      RUN_MODE_SERVER = 3;
    }

    // Host and port configuration for server mode.
    message ListenHost {
      // Hostname or IP address to bind the server to.
      string host = 1;

      // Port number to bind the server to.
      Port port = 2;
    }

    // Server configuration.
    message ServerConfig {
      // Listener configuration.
      oneof listener {
        // Host and port to listen on.
        ListenHost host_port = 1;

        // Pre-existing socket to bind to.
        Socket socket = 2;
      }
    }

    // Models a 'run' command invocation.
    message RunInvocation {
      // Source code input for the 'run' command.
      oneof source_code {
        // File-based source code.
        FileRunInvocation file = 1;

        // Inline source code.
        string code = 2;
      }

      // Run mode for this invocation.
      RunMode mode = 3;

      // Server configuration, as applicable, when `mode` is `serve`.
      ServerConfig server = 4;

      // Arguments for the script.
      repeated Argument script_args = 5;
    }

    // Command being invoked.
    oneof command {
      // 'run' command invocation.
      RunInvocation run = 10;

      // Tool invocation.
      ToolInvocation tool = 11;
    }
  }

  // Models an HTTP request as an invocation.
  message HttpInvocation {}

  // Specifies the invocation payload attached to this record.
  oneof invocation {
    // Command-line invocation.
    CliInvocation cli = 10;

    // HTTP request as an invocation.
    HttpInvocation http = 11;
  }
}
```

---

## Protocol Cross-Reference Summary

### Which Crates Use Each Protocol

| Protocol File | Crates That Use It |
|---------------|-------------------|
| base.capnp / base.proto | rpc (base_capnp) |
| cli.capnp / cli.proto | rpc (cli_capnp), cli crate |
| env.capnp / env.proto | rpc (env_capnp) |
| url.capnp / url.proto | rpc (url_capnp), transport |
| http.capnp / http.proto | rpc (http_capnp), http crate |
| sys.capnp / sys.proto | rpc (sys_capnp), sys crate |
| tools.capnp / tools.proto | rpc (tools_capnp), cli crate |
| engine.capnp / engine.proto | rpc (engine_capnp), runtime |
| invocation.capnp / invocation.proto | rpc (invocation_capnp) |

### Dependency Graph

```
base.capnp
    └── env.capnp
    └── invocation.capnp

cli.capnp
    └── sys.capnp (FilePath)
    └── tools.capnp (Argument, ArgumentSlice)
    └── invocation.capnp (multiple imports)

env.capnp
    └── base.capnp

url.capnp
    └── http.capnp

http.capnp
    └── url.capnp (URL)
    └── invocation.capnp

sys.capnp
    └── cli.capnp
    └── tools.capnp
    └── invocation.capnp

tools.capnp
    └── cli.capnp (Argument, ArgumentSlice)
    └── invocation.capnp

engine.capnp
    └── invocation.capnp

invocation.capnp (imports all)
    └── base.capnp
    └── http.capnp
    └── tools.capnp
    └── sys.capnp
    └── cli.capnp
    └── env.capnp
    └── engine.capnp
```

---

## Summary Statistics

| Protocol | .capnp Lines | .proto Lines | Structs/Messages | Enums |
|----------|--------------|--------------|------------------|-------|
| base | 63 | 70 | 0 | 3 |
| cli | 99 | 46 | 3 | 1 |
| env | 78 | 79 | 4 | 1 |
| url | 22 | 31 | 1 | 0 |
| http | 187 | 99 | 10 | 2 |
| sys | 201 | 200 | 15 | 0 |
| tools | 64 | 76 | 1 | 1 |
| engine | 79 | 79 | 2 | 2 |
| invocation | 191 | 146 | 10 | 1 |

**Total: 18 protocol files (9 .capnp + 9 .proto), ~1,600 lines**

---

End of Phase 2 Protocol Catalog.
