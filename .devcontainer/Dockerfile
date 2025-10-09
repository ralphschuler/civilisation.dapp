# Accept NODE_VERSION from devcontainers (your log shows --build-arg NODE_VERSION=22)
ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-bookworm-slim

# Build args / versions
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=1000

ARG BUN_VERSION=1.1.34
ARG FOUNDRY_VERSION=stable

ENV BUN_VERSION=${BUN_VERSION} \
    FOUNDRY_VERSION=${FOUNDRY_VERSION} \
    DEBIAN_FRONTEND=noninteractive

# Base deps
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
      git curl ca-certificates openssh-client \
      build-essential pkg-config libssl-dev \
      unzip zip bash jq wget sudo gnupg; \
    rm -rf /var/lib/apt/lists/*

# Create or normalize the user/group safely (works if they already exist)
RUN set -eux; \
    if ! getent group "${USER_GID}" >/dev/null; then \
      if getent group "${USERNAME}" >/dev/null; then \
        groupmod -g "${USER_GID}" "${USERNAME}"; \
      else \
        groupadd --gid "${USER_GID}" "${USERNAME}"; \
      fi; \
    fi; \
    if ! id -u "${USERNAME}" >/dev/null 2>&1; then \
      useradd --uid "${USER_UID}" --gid "${USER_GID}" -m "${USERNAME}"; \
    else \
      usermod --gid "${USER_GID}" "${USERNAME}" || true; \
      usermod --uid "${USER_UID}" "${USERNAME}" || true; \
      mkdir -p "/home/${USERNAME}"; \
      chown -R "${USER_UID}:${USER_GID}" "/home/${USERNAME}"; \
    fi; \
    echo "${USERNAME} ALL=(ALL) NOPASSWD:ALL" > "/etc/sudoers.d/99-${USERNAME}"

USER ${USERNAME}
WORKDIR /workspaces

# PATH for home-installed tools
ENV PATH="/home/${USERNAME}/.bun/bin:/home/${USERNAME}/.foundry/bin:${PATH}"

# Post-create installer
COPY --chown=${USERNAME}:${USERNAME} devcontainer-postcreate.sh /usr/local/bin/devcontainer-postcreate.sh
RUN sudo chmod +x /usr/local/bin/devcontainer-postcreate.sh

SHELL ["/bin/bash", "-lc"]
