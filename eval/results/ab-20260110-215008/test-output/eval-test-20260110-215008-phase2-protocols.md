# Phase 2: Protocol Definitions Complete Extract

Generated: 2026-01-11
Total Protocol Files: 18 (9 .proto + 9 .capnp pairs)

---

## Protocol: base

### base.proto (Full Content)

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

### base.capnp (Full Content)

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

### Messages/Types Summary (base)
| Type | Proto | Cap'n Proto |
|------|-------|-------------|
| ProtocolVersion | enum (3 values) | enum (2 values) |
| ProtocolFormat | enum (4 values) | enum (4 values) |
| AppEnvironment | enum (5 values) | enum (5 values) |

---

## Protocol: cli

### cli.proto (Full Content)

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

### cli.capnp (Full Content)

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

### Messages/Types Summary (cli)
| Type | Proto | Cap'n Proto |
|------|-------|-------------|
| Argument | message (key, value oneof) | struct (key, value union) |
| ArgumentSuite | - | struct (args union) |
| ArgumentSlice | - | struct (offset, count) |
| CliCommand | - | enum (26 values) |

---

## Protocol: env

### env.proto (Full Content)

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

### env.capnp (Full Content)

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

---

## Protocol: http

### http.proto (Full Content)

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

### http.capnp (Full Content)

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

---

## Protocol: url

### url.proto (Full Content)

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

### url.capnp (Full Content)

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

## Protocol: sys

### sys.proto (Full Content)

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
  // Octet 1-8.
  uint32 octet1 = 1;
  uint32 octet2 = 2;
  uint32 octet3 = 3;
  uint32 octet4 = 4;
  uint32 octet5 = 5;
  uint32 octet6 = 6;
  uint32 octet7 = 7;
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

### sys.capnp (Full Content)

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
  octet2 @1 :UInt8;
  octet3 @2 :UInt8;
  octet4 @3 :UInt8;
}

struct IPv6Address {
  # Represents an IPv6 address.

  segment1 @0 :UInt16;
  segment2 @1 :UInt16;
  segment3 @2 :UInt16;
  segment4 @3 :UInt16;
  segment5 @4 :UInt16;
  segment6 @5 :UInt16;
  segment7 @6 :UInt16;
  segment8 @7 :UInt16;
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

---

## Protocol: engine

### engine.proto (Full Content)

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

### engine.capnp (Full Content)

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

---

## Protocol: tools

### tools.proto (Full Content)

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

### tools.capnp (Full Content)

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

---

## Protocol: invocation

### invocation.proto (Full Content - 146 lines)

```protobuf
/*
 * Copyright (c) 2024-2025 Elide Technologies, Inc. All Rights Reserved.
 */

syntax = "proto3";

package elide.v1;

import "elide/v1/base.proto";
import "elide/v1/cli.proto";
import "elide/v1/engine.proto";
import "elide/v1/env.proto";
import "elide/v1/sys.proto";
import "elide/v1/tools.proto";

// Invocation of a script or file.
message FileRunInvocation {
  FilePath filepath = 1;
}

// Invocation of the Elide command-line binary.
message EngineInvocation {
  string binpath = 1;
  repeated Argument args = 2;
  EnvironmentMap env = 3;
  InvocationMetadata meta = 4;

  message InvocationMetadata {
    AppEnvironment app_environment = 1;
    EngineConfig engine_config = 2;
  }

  message CliInvocation {
    enum RunMode {
      RUN_MODE_UNSPECIFIED = 0;
      RUN_MODE_STANDARD = 1;
      RUN_MODE_INTERACTIVE = 2;
      RUN_MODE_SERVER = 3;
    }

    message ListenHost {
      string host = 1;
      Port port = 2;
    }

    message ServerConfig {
      oneof listener {
        ListenHost host_port = 1;
        Socket socket = 2;
      }
    }

    message RunInvocation {
      oneof source_code {
        FileRunInvocation file = 1;
        string code = 2;
      }
      RunMode mode = 3;
      ServerConfig server = 4;
      repeated Argument script_args = 5;
    }

    oneof command {
      RunInvocation run = 10;
      ToolInvocation tool = 11;
    }
  }

  message HttpInvocation {}

  oneof invocation {
    CliInvocation cli = 10;
    HttpInvocation http = 11;
  }
}
```

### invocation.capnp (Full Content - 191 lines)

```capnp
@0xe123c205d2399ae0;

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
  filepath @0 :System.FilePath;
}

struct EngineInvocation {
  binpath @0 :Text;
  args @1 :ArgumentSuite;
  env @2 :EnvironmentMap;
  meta @3 :InvocationMetadata;

  reserved1 @4 :Void;
  reserved2 @5 :Void;

  struct InvocationMetadata {
    appEnvironment @0 :Base.AppEnvironment;
    engineConfig @1 :EngineConfig;
  }

  struct CliInvocation {
    struct GlobalFlags {
      debug @0 :Bool;
      quiet @1 :Bool;
      noColor @2 :Bool;
      crash @3 :Bool;
      noNative @4 :Bool;
      noTelemetry @5 :Bool;
    }

    enum RunMode {
      unspecified @0;
      standard @1;
      interactive @2;
      serve @3;
    }

    struct ListenHost {
      host @0 :Text;
      port @1 :System.Port;
    }

    struct ServerConfig {
      listener :union {
        hostPort @0 :ListenHost;
        socket @1 :System.Socket;
      }
    }

    struct RunInvocation {
      sourceCode :union {
        file @0 :FileRunInvocation;
        code @1 :Text;
      }
      mode @2 :RunMode;
      server @3 :ServerConfig;
      scriptArgs @4 :ArgumentSlice;
    }

    command :union {
      run @0 :RunInvocation;
      tool @1 :Tools.ToolInvocation;
    }

    subcommand @2 :CliCommand;
    flags @3 :GlobalFlags;
  }

  struct HttpInvocation {
    requestId @0 : Int64;
    request @1 : Http.HttpRequest;
  }

  invocation :union {
    noContext @6 :Void;
    cli @7 :CliInvocation;
    http @8 :HttpInvocation;
  }
}
```

---

# Cross-Reference: Crates Using Protocol Messages

| Protocol | Used By Crate(s) |
|----------|------------------|
| base.capnp | rpc (base_capnp) |
| cli.capnp | rpc (cli_capnp), invocation |
| env.capnp | rpc (env_capnp), invocation |
| url.capnp | rpc (url_capnp), http |
| http.capnp | rpc (http_capnp), invocation |
| sys.capnp | rpc (sys_capnp), cli, invocation |
| tools.capnp | rpc (tools_capnp), invocation |
| engine.capnp | rpc (engine_capnp), invocation |
| invocation.capnp | rpc (invocation_capnp) |
| envelope.capnp | rpc (envelope_capnp) |
| dns.capnp | dns crate |

---

# Protocol Summary Table

| Protocol | Enums | Messages/Structs | Proto Lines | Cap'n Lines |
|----------|-------|------------------|-------------|-------------|
| base | 3 | 0 | 70 | 63 |
| cli | 0 (proto), 1 (capnp) | 1 (proto), 3 (capnp) | 46 | 99 |
| env | 1 | 3 | 79 | 78 |
| http | 2 | 8 (stub proto), 8 (full capnp) | 99 | 187 |
| url | 0 | 1 | 31 | 22 |
| sys | 0 | 15 | 200 | 201 |
| engine | 2 | 1 | 79 | 79 |
| tools | 1 | 1 | 76 | 64 |
| invocation | 0 | 7 | 146 | 191 |

**Total Protocol Files: 18**
**Total Lines: ~1,700+**
