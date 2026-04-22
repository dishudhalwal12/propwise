#!/usr/bin/env bash

set -euo pipefail

MODE="${1:-start}"
shift || true

LOCAL_JAVA_HOME="${HOME}/.local/propwise/jdk-21/Contents/Home"

if [[ -d "${LOCAL_JAVA_HOME}" ]]; then
  export JAVA_HOME="${JAVA_HOME:-${LOCAL_JAVA_HOME}}"
  export PATH="${JAVA_HOME}/bin:${PATH}"
fi

case "${MODE}" in
  start)
    exec firebase emulators:start --project demo-propwise --only auth,firestore,storage "$@"
    ;;
  exec)
    if [[ $# -eq 0 ]]; then
      echo "Usage: ./scripts/firebase-emulators.sh exec \"<command>\"" >&2
      exit 1
    fi
    exec firebase emulators:exec --project demo-propwise --only auth,firestore,storage "$1"
    ;;
  *)
    echo "Unknown mode: ${MODE}" >&2
    exit 1
    ;;
esac
