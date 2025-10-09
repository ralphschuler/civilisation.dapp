ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-bookworm-slim

ARG USERNAME=node
ARG USER_UID=1000
ARG USER_GID=1000

ARG BUN_VERSION=1.1.34
ARG FOUNDRY_VERSION=stable

ENV BUN_VERSION=${BUN_VERSION} \
    FOUNDRY_VERSION=${FOUNDRY_VERSION} \
    DEBIAN_FRONTEND=noninteractive

RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
      git curl ca-certificates openssh-client \
      build-essential pkg-config libssl-dev \
      unzip zip bash jq wget sudo gnupg; \
    rm -rf /var/lib/apt/lists/*

RUN set -eux; \
    echo "${USERNAME} ALL=(ALL) NOPASSWD:ALL" > "/etc/sudoers.d/99-${USERNAME}"; \
    chmod 0440 "/etc/sudoers.d/99-${USERNAME}"

USER ${USERNAME}
WORKDIR /workspaces

ENV PATH="/home/${USERNAME}/.bun/bin:/home/${USERNAME}/.foundry/bin:${PATH}"

# Post-create installer
COPY --chown=${USERNAME}:${USERNAME} devcontainer-postcreate.sh /usr/local/bin/devcontainer-postcreate.sh
RUN sudo chmod +x /usr/local/bin/devcontainer-postcreate.sh

SHELL ["/bin/bash", "-lc"]
