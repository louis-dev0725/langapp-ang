ARG BASE_IMAGE=php-nginx
FROM webdevops/${BASE_IMAGE}:7.4 AS dev

# Environment settings
ENV COMPOSER_ALLOW_SUPERUSER=1

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- \
    --filename=composer \
    --version=2.1.12 \
    --install-dir=/usr/local/bin && \
    composer clear-cache

# Install Yii framework bash autocompletion
#RUN curl -L https://raw.githubusercontent.com/yiisoft/yii2/master/contrib/completion/bash/yii \
#        -o /etc/bash_completion.d/yii

# Install mecab
ENV mecab_url https://drive.google.com/uc?export=download&id=0B4y35FiV1wh7cENtOXlicTFaRUE
RUN set -x \
    && CPUCOUNT=$(getconf _NPROCESSORS_ONLN) \
    # Install MeCab
    && wget -q -O - ${mecab_url} \
    | tar -xzf - -C /tmp \
    && cd /tmp/mecab-[0-9]* \
    && ./configure --enable-utf8-only --with-charset=utf8 --prefix=/usr \
    && make  -j ${CPUCOUNT} \
    && make install \
    && rm -R /tmp/mecab-[0-9]*

# Install mecab-ipadic
ENV mecab_ipa_url https://drive.google.com/uc?export=download&id=0B4y35FiV1wh7MWVlSDBCSXZMTXM
RUN set -x \
    && CPUCOUNT=$(getconf _NPROCESSORS_ONLN) \
    && wget -q -O - ${mecab_ipa_url} \
    | tar -xzf - -C /tmp \
    && cd /tmp/mecab-ipadic-[0-9]* \
    && ./configure --enable-utf8-only --with-charset=utf8 --prefix=/usr \
    && make  -j ${CPUCOUNT} \
    && make install \
    && rm -R /tmp/mecab-ipadic-[0-9]*

# Install postgres client, iputils, screen
RUN (apt-get update || true) && apt-get install -y lsb-release && sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list' && (wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -) && (apt-get update || true) && apt-get install -y postgresql-client-13 iproute2 iputils-ping screen --no-install-recommends && apt-get clean all

# Install node (see https://github.com/nodejs/docker-node/blob/master/12/buster/Dockerfile)
ENV NODE_VERSION 14.19.3

RUN ARCH= && dpkgArch="$(dpkg --print-architecture)" \
  && case "${dpkgArch##*-}" in \
    amd64) ARCH='x64';; \
    ppc64el) ARCH='ppc64le';; \
    s390x) ARCH='s390x';; \
    arm64) ARCH='arm64';; \
    armhf) ARCH='armv7l';; \
    i386) ARCH='x86';; \
    *) echo "unsupported architecture"; exit 1 ;; \
  esac \
  # gpg keys listed at https://github.com/nodejs/node#release-keys
  && set -ex \
  && for key in \
    4ED778F539E3634C779C87C6D7062848A1AB005C \
    141F07595B7B3FFE74309A937405533BE57C7D57 \
    94AE36675C464D64BAFA68DD7434390BDBE9B9C5 \
    74F12602B6F1C4E913FAA37AD3A89613643B6201 \
    71DCFD284A79C3B38668286BC97EC7A07EDE3FC1 \
    61FC681DFB92A079F1685E77973F295594EC4689 \
    8FCCA13FEF1D0C2E91008E09770F7A9A5AE15600 \
    C4F0DFFF4E8C1A8236409D08E73BC641CC11F4C8 \
    C82FA3AE1CBEDC6BE46B9360C43CEC45C17AB93C \
    DD8F2338BAE7501E3DD5AC78C273792F7D83545D \
    A48C2BEE680E841632CD4E44F07496B3EB3C1762 \
    108F52B48DB57BB0CC439B2997B01419BD92F80A \
    B9E2F5981AA6E0CD28160D9FF13993A75599653C \
  ; do \
      gpg --batch --keyserver hkps://keys.openpgp.org --recv-keys "$key" || \
      gpg --batch --keyserver keyserver.ubuntu.com --recv-keys "$key" ; \
  done \
  && curl -fsSLO --compressed "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-$ARCH.tar.xz" \
  && curl -fsSLO --compressed "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \
  && gpg --batch --decrypt --output SHASUMS256.txt SHASUMS256.txt.asc \
  && grep " node-v$NODE_VERSION-linux-$ARCH.tar.xz\$" SHASUMS256.txt | sha256sum -c - \
  && tar -xJf "node-v$NODE_VERSION-linux-$ARCH.tar.xz" -C /usr/local --strip-components=1 --no-same-owner \
  && rm "node-v$NODE_VERSION-linux-$ARCH.tar.xz" SHASUMS256.txt.asc SHASUMS256.txt \
  && ln -s /usr/local/bin/node /usr/local/bin/nodejs \
  # smoke tests
  && node --version \
  && npm --version

ENV YARN_VERSION 1.22.19

RUN set -ex \
  && for key in \
    6A010C5166006599AA17F08146C2130DFD2497F5 \
  ; do \
    gpg --batch --keyserver hkps://keys.openpgp.org --recv-keys "$key" || \
    gpg --batch --keyserver keyserver.ubuntu.com --recv-keys "$key" ; \
  done \
  && curl -fsSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz" \
  && curl -fsSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz.asc" \
  && gpg --batch --verify yarn-v$YARN_VERSION.tar.gz.asc yarn-v$YARN_VERSION.tar.gz \
  && mkdir -p /opt \
  && tar -xzf yarn-v$YARN_VERSION.tar.gz -C /opt/ \
  && ln -s /opt/yarn-v$YARN_VERSION/bin/yarn /usr/local/bin/yarn \
  && ln -s /opt/yarn-v$YARN_VERSION/bin/yarnpkg /usr/local/bin/yarnpkg \
  && rm yarn-v$YARN_VERSION.tar.gz.asc yarn-v$YARN_VERSION.tar.gz \
  # smoke test
  && yarn --version

# Install jumanpp
RUN set -ex \
    && curl -fsSLO --compressed "https://github.com/ku-nlp/jumanpp/releases/download/v2.0.0-rc3/jumanpp-2.0.0-rc3.tar.xz" \
    && mkdir -p /var/lib/jumanpp \
    && tar xf jumanpp-2.0.0-rc3.tar.xz --strip-components=2 -C /var/lib/jumanpp jumanpp-2.0.0-rc3/model/jumandic.jppmdl \
    && rm jumanpp-2.0.0-rc3.tar.xz

COPY ./run/ /opt/run/

# Application environment
WORKDIR /app/


#FROM dev as prod

FROM dev as prod-backend
COPY ./backend/composer.json ./backend/composer.lock /app/backend/
RUN cd /app/backend/ && composer install --prefer-dist --no-scripts --no-dev --no-autoloader && rm -rf /root/.composer
COPY ./backend /app/backend
RUN cd /app/backend/ && composer dump-autoload --no-scripts --no-dev --optimize
RUN mkdir /app/backend/runtime; mkdir /app/backend/web/yii-assets; chown application:application /app/backend/runtime/ -R; chown application:application /app/backend/web/assets/ -R; chown application:application /app/backend/web/yii-assets/ -R

FROM prod-backend as prod-backend-cleaned
RUN rm -R /app/backend/vendor

FROM dev as prod-backend-ts
COPY ./backend-ts/package.json ./backend-ts/package-lock.json /app/backend-ts/
RUN cd /app/backend-ts/ && npm ci
COPY ./backend-ts/ /app/backend-ts/
RUN cd /app/backend-ts/ && npm run build
# Copy to separate dir to be able to copy it separately (used for better cache)
#RUN mv /app/backend-ts/node_modules /app/to-copy-backend-ts-node_modules

FROM prod-backend-ts as prod-backend-ts-cleaned
RUN rm -R /app/backend-ts/node_modules

FROM dev as prod-frontend
COPY ./frontend/package.json ./frontend/package-lock.json /app/frontend/
RUN cd /app/frontend/ && npm ci
COPY ./frontend/ /app/frontend/
COPY ./extension/ /app/extension/
RUN cd /app/frontend/ && npm run build:prod
# Copy to separate dir to be able to copy it separately (used for better cache)
#RUN mv /app/frontend/node_modules /app/to-copy-frontend-node_modules

FROM prod-frontend as prod-frontend-cleaned
RUN rm -R /app/frontend/node_modules

FROM dev as prod
COPY ./docker/web/nginx/vhost.conf /opt/docker/etc/nginx/vhost.conf
COPY ./docker/web/nginx/vhost-prod.conf /opt/docker/etc/nginx/vhost-prod.conf
COPY ./docker/web/php/php.ini /opt/docker/etc/php/php.ini
COPY ./docker/web/supervisord/postfix.conf /opt/docker/etc/supervisor.d/postfix.conf
COPY ./docker/web/supervisord/juman.conf /opt/docker/etc/supervisor.d/juman.conf
COPY ./docker/web/supervisord/backendts.conf /opt/docker/etc/supervisor.d/backendts.conf
COPY ./docker/web/entrypoint.sh /opt/docker/bin/entrypoint.d/app.sh
COPY ./docker /app/docker
COPY ./run /app/run

# Copy only vendor/node_modules from separate dirs (used for better cache)
# COPY --from=prod-backend /app/to-copy-backend-vendor /app/backend/vendor
# COPY --from=prod-backend-ts /app/to-copy-backend-ts-node_modules /app/backend-ts/node_modules
# COPY --from=prod-frontend /app/to-copy-frontend-node_modules /app/frontend/node_modules
COPY --from=prod-backend-ts /app/backend-ts/node_modules /app/backend-ts/node_modules
# COPY --from=prod-frontend /app/frontend/node_modules /app/frontend/node_modules
COPY --from=prod-backend /app/backend/vendor /app/backend/vendor

COPY --from=prod-backend-cleaned /app/backend /app/backend
COPY --from=prod-backend-ts-cleaned /app/backend-ts /app/backend-ts
COPY --from=prod-frontend-cleaned /app/frontend /app/frontend

# TODO: Probably there is no need for node_modules in frontend, we can just use build